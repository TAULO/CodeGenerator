const contractPeriod = () => {
  const pagePeriods = {
    totalContractPeriod: 0,

    callOffPeriodYears() {
      return parseInt($('#initialCallOffPeriodYears').val()) * 156
    },

    callOffPeriodMonths() {
      return parseInt($('#initialCallOffPeriodMonths').val()) * 13
    },

    mobilisationPeriodChecked() {
      return $('#mobilisationPeriodRequiredTrue').is(':checked')
    },

    mobilisationPeriod() {
      return parseInt($('#mobilisationPeriod').val()) * 3
    },

    extensionChecked() {
      return $('#optionalCallOffRequiredTrue').is(':checked')
    },

    extensionYears(extension) {
      return parseInt($(`#extensionPeriodYears${extension}`).val()) * 156
    },

    extensionMonths(extension) {
      return parseInt($(`#extensionPeriodMonths${extension}`).val()) * 13
    },

    yearsAndMonthsInomplete(years, months) {
      return Number.isNaN(years) || Number.isNaN(months) || (years + months) === 0
    },

    allPeriodInputsComplete() {
      if (this.yearsAndMonthsInomplete(this.callOffPeriodYears(), this.callOffPeriodMonths())) return false

      if (this.mobilisationPeriodChecked() && !(this.mobilisationPeriod() > 0)) return false

      let extensionsCompleted = true

      if (this.extensionChecked()) {
        for (let extension = 0; extension <= 3; extension++) {
          if ($(`#extension${extension}Container`).hasClass('govuk-visually-hidden')) break

          extensionsCompleted = !this.yearsAndMonthsInomplete(this.extensionYears(extension), this.extensionMonths(extension))

          if (!extensionsCompleted) break
        }
      }

      return extensionsCompleted
    },

    calculateTotalContractPeriod() {
      let totalPeriod = 0

      totalPeriod += this.callOffPeriodYears() + this.callOffPeriodMonths()

      totalPeriod += this.mobilisationPeriodChecked() ? this.mobilisationPeriod() : 0

      if (this.extensionChecked()) {
        for (let extension = 0; extension <= 3; extension++) {
          if ($(`#extension${extension}Container`).hasClass('govuk-visually-hidden')) break

          totalPeriod += this.extensionYears(extension) + this.extensionMonths(extension)
        }
      }

      this.totalContractPeriod = totalPeriod
    },

    totalTimeRemaining() {
      return 1560 - this.totalContractPeriod
    },

    timeRemaining() {
      const totalTimeRemaining = this.totalTimeRemaining()

      const years = Math.floor(totalTimeRemaining / 156)
      const months = Math.floor((totalTimeRemaining % 156) / 13)

      return [years, months]
    },
  }

  const extensionPeriods = {
    showExtensionPeriod(extension) {
      $(`#extension${extension}Container`).removeClass('govuk-visually-hidden')
      $(`#extensionPeriodYears${extension}`).attr('tabindex', 0)
      $(`#extensionPeriodMonths${extension}`).attr('tabindex', 0)
      $(`#extensionPeriodRequired${extension}`).val('true')
      this.showRemoveButton(extension)
    },

    hideExtensionPeriod(extension) {
      $(`#extension${extension}Container`).addClass('govuk-visually-hidden')
      this.resetInput(extension, 'Years')
      this.resetInput(extension, 'Months')
      $(`#extensionPeriodRequired${extension}`).val('false')
      $(`#extension${extension}Container .govuk-error-message`).each(function () {
        $(this).remove()
      })
      this.hideRemoveButton(extension)
    },

    hideRemoveButton(extension) {
      $(`#extension${extension}RemoveButton`).addClass('govuk-visually-hidden')
      $(`#extension${extension}RemoveButton`).attr('tabindex', -1)
    },

    showRemoveButton(extension) {
      $(`#extension${extension}RemoveButton`).removeClass('govuk-visually-hidden')
      $(`#extension${extension}RemoveButton`).attr('tabindex', 0)
    },

    resetInput(extension, attribute) {
      const element = $(`#extensionPeriod${attribute}${extension}`)
      element.attr('tabindex', -1)
      element.val('')
      element.removeClass('govuk-input--error')
    },
  }

  const addExtensionPeriodButton = {
    addExtensionButton: $('#addContractExtensionButton'),

    ableToAddPeriod() {
      if (this.forthExtensionRequired()) return false
      if (!pagePeriods.allPeriodInputsComplete()) return false

      pagePeriods.calculateTotalContractPeriod()
      if (this.noTimePeriodLeftToAdd()) return false

      return true
    },

    updateButtonVisibility() {
      if (!pagePeriods.extensionChecked() || this.forthExtensionRequired() || this.noTimePeriodLeftToAdd()) {
        this.hideButton()
      } else {
        this.showButton()
      }
    },

    updateButtonText() {
      this.addExtensionButton.text(this.getButtonText())
    },

    getButtonText() {
      const timeRemainingParts = pagePeriods.timeRemaining()
      const years = timeRemainingParts[0]
      const months = timeRemainingParts[1]

      let text = 'Add another extension period ('

      if (years > 0) text += `${years} year`
      if (years > 1) text += 's'
      if (years > 0 && months > 0) text += ' and '
      if (months > 0) text += `${months} month`
      if (months > 1) text += 's'

      return `${text} remaining)`
    },

    forthExtensionRequired() {
      return $('#extensionPeriodRequired3').val() === 'true'
    },

    noTimePeriodLeftToAdd() {
      return pagePeriods.totalTimeRemaining() < 13
    },

    hideButton() {
      this.addExtensionButton.addClass('govuk-visually-hidden')
      this.addExtensionButton.attr('tabindex', -1)
    },

    showButton() {
      this.addExtensionButton.removeClass('govuk-visually-hidden')
      this.addExtensionButton.attr('tabindex', 0)
    },

    updateButtonState() {
      if (pagePeriods.allPeriodInputsComplete()) {
        pagePeriods.calculateTotalContractPeriod()
        this.updateButtonVisibility()
        this.updateButtonText()
      }
    },
  }

  $('#optionalCallOffRequiredTrue').on('click', () => {
    extensionPeriods.showExtensionPeriod(0)
    addExtensionPeriodButton.hideButton()
    if (addExtensionPeriodButton.ableToAddPeriod()) addExtensionPeriodButton.showButton()
  })

  $('#optionalCallOffRequiredFalse').on('click', () => {
    $('.extensionContainer').each((extension) => {
      extensionPeriods.hideExtensionPeriod(extension)
    })
    addExtensionPeriodButton.hideButton()
  })

  $('.extensionRemoveButton').each(function () {
    $(this).on('click', (e) => {
      e.preventDefault()

      extensionPeriods.hideExtensionPeriod($(this).attr('data-extension'))
      extensionPeriods.showRemoveButton($(this).attr('data-extension') - 1)

      if (addExtensionPeriodButton.ableToAddPeriod()) {
        addExtensionPeriodButton.updateButtonVisibility()
        addExtensionPeriodButton.updateButtonText()
      }
    })
  })

  $('#addContractExtensionButton').on('click', (e) => {
    e.preventDefault()

    if (addExtensionPeriodButton.ableToAddPeriod()) {
      const nextExtension = $($('.extensionContainer.govuk-visually-hidden').get(0)).attr('data-extension')
      extensionPeriods.showExtensionPeriod(nextExtension)
      extensionPeriods.hideRemoveButton(nextExtension - 1)

      addExtensionPeriodButton.updateButtonVisibility()
      addExtensionPeriodButton.updateButtonText()
    }
  })

  $('.periodInput').on('keyup', () => {
    addExtensionPeriodButton.updateButtonState()
  })

  $('#mobilisationPeriodRequiredTrue').on('click', () => {
    addExtensionPeriodButton.updateButtonState()
  })

  $('#mobilisationPeriodRequiredFalse').on('click', () => {
    addExtensionPeriodButton.updateButtonState()
  })

  if (addExtensionPeriodButton.ableToAddPeriod()) {
    addExtensionPeriodButton.updateButtonText()
    addExtensionPeriodButton.updateButtonVisibility()
  } else {
    addExtensionPeriodButton.hideButton()
  }
}

export { contractPeriod }
