require "rails/generators"
require "rails/generators/erb/scaffold/scaffold_generator"

module Erb
  module Generators
    class ScaffoldGenerator
      source_paths << File.expand_path("../templates", __FILE__)

      def available_views
        %w[index edit show new _form _search _filter _sort _header]
      end

      def copy_view_files
        available_views.each do |view|
          formats.each do |format|
            filename = filename_with_extensions(view, format)
            template filename, File.join("app/views", controller_file_path, filename)
          end
        end
      end
      hook_for :jbuilder, type: :boolean, default: true

      def add_to_navigation
        append_to_file "app/views/shared/_left_nav.html.erb" do
          "<%= nav_link_to \"#{plural_name.titleize}\", #{plural_route_name}_path, class: 'nav-link-mobile' if allowed_to?(:index?, #{class_name}, with: #{class_name}Policy ) %>\n"
        end
      end

      def copy_action_policy
        file_name = class_name.downcase.to_s
        template "policy.rb.tt", File.join("app/policies", class_path, "#{file_name}_policy.rb")
        template "policy_test.rb.tt", File.join("test/policies", class_path, "#{file_name}_policy_test.rb")
      end
    end
  end
end
