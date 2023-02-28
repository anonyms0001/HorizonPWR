namespace :canvass do
  desc "Finds all active sales reps and sync's their current and future appointments to pwrstation"
  task sync_all_active_reps_appointments: :environment do
    CanvassSyncAllActiveRepsAppointmentsJob.perform_later
  end
end
