# frozen_string_literal: true

class ExampleReflex < ApplicationReflex
  # Add Reflex methods in this file.
  #
  # All Reflex instances include CableReady::Broadcaster and expose the following properties:
  #
  #   - connection  - the ActionCable connection
  #   - channel     - the ActionCable channel
  #   - request     - an ActionDispatch::Request proxy for the socket connection
  #   - session     - the ActionDispatch::Session store for the current visitor
  #   - flash       - the ActionDispatch::Flash::FlashHash for the current request
  #   - url         - the URL of the page that triggered the reflex
  #   - params      - parameters from the element's closest form (if any)
  #   - element     - a Hash like object that represents the HTML element that triggered the reflex
  #     - signed    - use a signed Global ID to map dataset attribute to a model eg. element.signed[:foo]
  #     - unsigned  - use an unsigned Global ID to map dataset attribute to a model  eg. element.unsigned[:foo]
  #   - cable_ready - a special cable_ready that can broadcast to the current visitor (no brackets needed)
  #   - reflex_id   - a UUIDv4 that uniquely identies each Reflex
  #
  # Example:
  #
  #   before_reflex do
  #     # throw :abort # this will prevent the Reflex from continuing
  #     # learn more about callbacks at https://docs.stimulusreflex.com/lifecycle
  #   end
  #
  #   def example(argument=true)
  #     # Your logic here...
  #     # Any declared instance variables will be made available to the Rails controller and view.
  #   end
  #
  # Learn more at: https://docs.stimulusreflex.com/reflexes#reflex-classes
  #

  # TODO: Intentionally using the example reflex for new stimulus reflex features because it is not our intention to use stimulus reflex for this going forward. We want to build this feature fast and get on to the next one, but we would rather build this using cable ready instead so that we are paying less for the benefits and so that there is better control. See >> for details https://gorails.com/episodes/how-to-use-cable-ready?autoplay=1
  #
  def toggle_tag
    attachment = ActiveStorage::Attachment.find(element.dataset[:attachment])
    attachment.tag_list.include?(element.dataset[:tag]) ? attachment.tag_list.remove(element.dataset[:tag]) : attachment.tag_list.add(element.dataset[:tag])
    attachment.save
  end
end
