// Load all the controllers within this directory and all subdirectories.
// Controller files must be named *_controller.js.

import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start()
const context = require.context("controllers", true, /_controller\.js$/)
application.load(definitionsFromContext(context))

import { Dropdown, Modal, Popover, Toggle, Slideover } from "tailwindcss-stimulus-components"
application.register('dropdown', Dropdown)
application.register('modal', Modal)
// application.register('tabs', Tabs) Intentionally removed because anchor links don't play nice.
application.register('popover', Popover)
application.register('toggle', Toggle)
application.register('slideover', Slideover)

import Flatpickr from 'stimulus-flatpickr'
application.register('flatpickr', Flatpickr)

import Chart from "stimulus-chartjs"
application.register("chart", Chart)

import StimulusReflex from 'stimulus_reflex'
import consumer from '../channels/consumer'
import controller from '../controllers/application_controller'
StimulusReflex.initialize(application, { consumer, controller, isolate: true })
StimulusReflex.debug = process.env.RAILS_ENV === 'development'

import Reveal from "stimulus-reveal-controller"
application.register("reveal", Reveal)

