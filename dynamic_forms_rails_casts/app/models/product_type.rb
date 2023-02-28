class ProductType < ApplicationRecord
	attr_accessor :name, :fields_attributes
 	has_many :fields, class_name: "ProductField"
 	accepts_nested_attributes_for :fields, allow_destroy: true
end
