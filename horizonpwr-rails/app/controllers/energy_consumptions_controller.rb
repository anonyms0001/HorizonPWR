class EnergyConsumptionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_proposal # , only: [:new, :edit, :update, :destroy]
  before_action :set_energy_consumption, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :new, :create]
  # before_action :set_usage_params, only: [:create, :update]

  # GET /energy_consumptions
  def index
    @pagy, @energy_consumptions = pagy(EnergyConsumption.sort_by_params(params[:sort], sort_direction))

    # We explicitly load the records to avoid triggering multiple DB calls in the views when checking if records exist and iterating over them.
    # Calling @energy_consumptions.any? in the view will use the loaded records to check existence instead of making an extra DB call.
    @energy_consumptions.load
    authorize! @energy_consumptions, with: EnergyConsumptionPolicy
  end

  # GET /energy_consumptions/1 or /energy_consumptions/1.json
  def show
  end

  # GET /energy_consumptions/new
  def new
    @energy_consumption = EnergyConsumption.new
    authorize! @energy_consumption, with: EnergyConsumptionPolicy
  end

  # GET /energy_consumptions/1/edit
  def edit
  end

  # POST /energy_consumptions or /energy_consumptions.json
  def create
    daily_usage = params[:energy_consumption][:daily_usage] if params[:energy_consumption][:daily_usage].reject(&:empty?).present?
    monthly_usage = params[:energy_consumption][:monthly_usage] if params[:energy_consumption][:monthly_usage].reject(&:empty?).present?
    energy_consumption = EnergyConsumption.new(monthly_usage: monthly_usage, daily_usage: daily_usage, proposal: @proposal, created_by: current_user, data_source: "pwrstation")

    if monthly_usage.nil? && daily_usage.nil?
      redirect_to new_proposal_energy_consumption_path(@proposal), notice: "Please submit either Monthly or Daily usage."
      nil
    elsif monthly_usage.present? && daily_usage.present?
      redirect_to new_proposal_energy_consumption_path(@proposal), alert: "You cannot submit BOTH Monthly and Daily usage!"
      nil
    else
      if monthly_usage.present?
        calculated_daily_usage = get_daily_usage(monthly_usage)
        energy_consumption.daily_usage = format_array_values(calculated_daily_usage)
        energy_consumption.monthly_usage = format_array_values(monthly_usage)
      elsif daily_usage.present?
        calculated_monthly_usage = get_monthly_usage(daily_usage)
        energy_consumption.monthly_usage = format_array_values(calculated_monthly_usage)
        energy_consumption.daily_usage = format_array_values(daily_usage)
      end

      authorize! energy_consumption, with: EnergyConsumptionPolicy

      response = AuroraClient.new.update_consumption(@proposal, energy_consumption.monthly_usage)

      if response["consumption_profile"].present?
        energy_consumption.monthly_usage = response["consumption_profile"]["monthly_energy"]
        # NOTE: Not sure why we were using format_array_values, which converted zeroes to "null"
        # calculated_daily_usage = get_daily_usage(energy_consumption.monthly_usage)
        # energy_consumption.daily_usage = format_array_values(calculated_daily_usage)
        calculated_daily_usage = get_daily_usage(energy_consumption.monthly_usage)
        energy_consumption.daily_usage = convert_to_integers(calculated_daily_usage)

        if energy_consumption.present? && energy_consumption.save
          redirect_to @proposal, notice: "Energy consumption was successfully created."
        else
          render :new, status: :unprocessable_entity
        end
      else
        redirect_to @proposal, notice: "Aurora Response: #{response}"
      end
    end
  end

  # PATCH/PUT /energy_consumptions/1 or /energy_consumptions/1.json
  def update
    daily_usage = params[:energy_consumption][:daily_usage] if params[:energy_consumption][:daily_usage].reject(&:empty?).present?
    monthly_usage = params[:energy_consumption][:monthly_usage] if params[:energy_consumption][:monthly_usage].reject(&:empty?).present?

    if monthly_usage.nil? && daily_usage.nil?
      redirect_to edit_proposal_energy_consumption_path(@proposal), alert: "No values were provided."
      nil
    elsif (daily_usage.present? && rounded_values(daily_usage) != @energy_consumption.daily_usage) && (monthly_usage.present? && rounded_values(monthly_usage) != @energy_consumption.monthly_usage)
      redirect_to edit_proposal_energy_consumption_path(@proposal), alert: "You cannot change BOTH the Monthly and Daily usage!"
      nil
    elsif daily_usage.present?
      if daily_usage.include?("null")
        # TODO: StandardRB says "Lint/UselessAssignment: Useless assignment to variable - `i`."
        daily_usage = energy_consumption.daily_usage.map { |i| i == "null" ? i = 0 : i }
      end

      # we need to fill in existing values for any fields that were not changed, prior to calculating monthly values
      complete_daily_usage = fill_in_existing_values(daily_usage, @energy_consumption.daily_usage)
      # we need to calculate monthly values
      calculated_monthly_usage = get_monthly_usage(complete_daily_usage)

      response = AuroraClient.new.update_consumption(@proposal, calculated_monthly_usage)

      if response["consumption_profile"].present?
        monthly_usage = response["consumption_profile"]["monthly_energy"]
        @energy_consumption.update(daily_usage: complete_daily_usage, monthly_usage: monthly_usage)
        notice_msg = "Energy consumption was successfully updated."
      else
        notice_msg = "Energy consumption could not be updated."
      end

      redirect_to edit_proposal_energy_consumption_path(@proposal), notice: notice_msg
    elsif monthly_usage.present?
      # we need to fill in existing values for any fields that were not changed, prior to submission to Aurora
      complete_monthly_usage = fill_in_existing_values(monthly_usage, @energy_consumption.monthly_usage)

      response = AuroraClient.new.update_consumption(@proposal, complete_monthly_usage)

      if response["consumption_profile"].present?
        monthly_usage = response["consumption_profile"]["monthly_energy"]
        calculated_daily_usage = get_daily_usage(monthly_usage)
        @energy_consumption.update(daily_usage: calculated_daily_usage, monthly_usage: monthly_usage)
        notice_msg = "Energy consumption was successfully updated."
      else
        notice_msg = "Energy consumption could not be updated."
      end

      redirect_to edit_proposal_energy_consumption_path(@proposal), notice: notice_msg
    else
      redirect_to edit_proposal_energy_consumption_path(@proposal), alert: "Energy consumption could not be updated."
    end
  end

  # DELETE /energy_consumptions/1 or /energy_consumptions/1.json
  def destroy
    @energy_consumption.destroy
    respond_to do |format|
      format.html { redirect_to @proposal, notice: "Energy consumption was successfully destroyed." }
      # format.json { head :no_content }
    end
  end

  private

  def get_multiplier(index)
    case index
    when 1
      28 # Date.leap?(Date.today.year) ? 29 : 28
    when 3, 5, 8, 10
      30
    else
      31
    end
  end

  def get_daily_usage(monthly_usage)
    # Divide each value by the number of days in that month
    daily_usage = []
    monthly_usage.each_with_index do |i, index|
      daily_usage << (i.to_f / get_multiplier(index)).round(1)
    end

    daily_usage
  end

  def get_monthly_usage(daily_usage)
    # Multiply each value by the number of days in that month
    monthly_usage = []
    daily_usage.each_with_index do |i, index|
      monthly_usage << i.to_i * get_multiplier(index)
    end

    monthly_usage
  end

  def convert_to_integers(array)
    array.map(&:to_i)
  end

  def format_array_values(array)
    # Convert zeroes to "null" and the rest to integers
    array.map { |i| i.to_i.zero? ? "null" : i.to_i }
  end

  def rounded_values(array)
    array.map { |i| i.to_i.round }
  end

  def fill_in_existing_values(array, usage)
    array.each_with_index.map { |i, index| i.present? ? i.to_i : usage[index] }
  end

  # def set_usage_params
  #   @submitted_monthly_usage = params[:energy_consumption][:monthly_usage].map(&:to_f) if params[:energy_consumption][:monthly_usage].reject(&:empty?).present?
  #   @submitted_daily_usage = params[:energy_consumption][:daily_usage].map(&:to_f) if params[:energy_consumption][:daily_usage].reject(&:empty?).present?
  # end

  def authorize_user!
    authorize! @energy_consumption, with: EnergyConsumptionPolicy
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_proposal
    @proposal = Proposal.find(params[:proposal_id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_energy_consumption
    @energy_consumption = EnergyConsumption.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def energy_consumption_params
    params.require(:energy_consumption).permit(:proposal_id, :updated_by_id, :created_by_id, :data_source, daily_usage: [], monthly_usage: [])
  end
end
