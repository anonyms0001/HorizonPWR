module EarningsHelper
  def collection_total(collection)
    collection.map(&:total).inject(0) { |sum, x| sum + x }
  end
end
