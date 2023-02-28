class Api::V1::UploadsController < Api::BaseController
  skip_before_action :authenticate_api_token!
  before_action :set_response
  wrap_parameters format: :multipart_form

  def create
    user = User.find_by(email: @response["workEmail"]) || User.find_by(secure_public_id: @response["user_id"]) || User.find(349)
    raw_pdf_str = Base64.decode64 @response["body"]

    contract_name = @response["document_type"]&.downcase || "b-contract"
    now = DateTime.now.strftime("%m_%d_%Y_%H:%M:%S")
    email = @response["workEmail"] || user.email
    user_name = email.split("@").first.tr(".", "_")
    @name = "#{user_name}_#{contract_name}_#{now}"

    file_name = @name || @response["name"]
    file_path = "#{Rails.root}/tmp/#{file_name}.pdf"
    File.open(file_path, "wb") { |f| f.write(raw_pdf_str) }

    user.documents.attach(io: File.open(file_path), filename: file_name, content_type: "application/pdf")
    sf_id = @response["sfId"]
    if sf_id.present? && Rails.env.production?
      client = SalesforceClient.new.client
      # Neither of these work right now for uploading the attachment to SF,
      # NoMethodError: undefined method `create' for #<SalesforceClient
      #
      client.create("Attachment", ParentId: sf_id,
                    Description: contract_name,
                    Name: file_name,
                    Body: Restforce::FilePart.new(File.expand_path(file_path, __FILE__), "application/pdf"))
      #
      # client.create('Attachment', ParentId: sf_id,
      #               Description: contract_name,
      #               Name: "#{file_name}.pdf",
      #               Body: Base64::encode64(File.read(file_path))
      # )
    end

    File.delete(file_path) if File.exist?(file_path)
  end

  private

  def set_response
    @response = request.request_parameters["document"]
  end
end

# name = user.name.parameterize.underscore
# name = @response['workEmail'].split("@").first.gsub(".", "_")
# user = User.find_by(email: @response['workEmail'])
# contract_name = "b-contract"
# now = DateTime.now.strftime("%m_%d_%Y_%H:%M:%S")
# name = "#{name}_#{contract_name}_#{now}"
#
# @response["sfId"]
# @response["workEmail"]
# @response["ref"]
# @response["document_type"]
# @response["name"]
# @response["body"]
#
# string.split("@").first.gsub(".", "_")
