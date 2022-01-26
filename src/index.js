import * as React from 'react'

import {
  RTFBannerImage,
  RTFFormBanner,
  RTFFormBannerDefault,
  RTFFormContainer,
  RTFFormWrapper,
  RTFTitleField
} from 'react-themed-fields'
import { useEffect, useState } from 'react'

import FieldLevelValidationForm from './components/field-validation-form'
import { Provider } from 'react-redux'
import * as Themes from './themes'

import { NoContent } from './components/no-content'

import { ThemeProvider } from 'styled-components'
import store from './store/store'
// import { dark } from './themes/dark'

const FormViewer = ({
  template,
  data,
  onChange,
  onControlValueChanged,
  controlMarker,
  editable,
  onButtonClick,
  onInject,
  controls = [],
  baseTheme = 'dark',
  themeOverride = {}
}) => {
  const [loading, setLoading] = useState(true)
  const [finalData, setFinalData] = useState({})
  const [localTemplate, setLocalTemplate] = useState({})
  const [finalTheme, setFinalTheme] = React.useState({})

  useEffect(() => {
    if (data) {
      setFinalData({ ...data })
    }
    if (template) {
      setLocalTemplate(JSON.parse(JSON.stringify(template)))
    }
    let defaultTheme = Themes[baseTheme]
    const oTheme = themeOverride
    defaultTheme = Object.assign(defaultTheme, oTheme)
    setFinalTheme(defaultTheme)

    setLoading(false)
  }, [data, template.fields])

  const controlValueChanged = (k, v, f) => {
    if (onControlValueChanged) {
      onControlValueChanged(k, v, f)
    }
  }

  const formValueChanged = (data) => {
    if (onChange) {
      onChange(data)
    }
  }

  const onValueChanged = (key, value, field) => {
    finalData[key] = value
    controlValueChanged(key, value, field)
    setFinalData({ ...finalData })
    formValueChanged(finalData)
  }

  return (
    <ThemeProvider theme={finalTheme}>
      <Provider store={store}>
        <RTFFormWrapper>
          <div>
            {localTemplate.banner ? (
              <div>
                {localTemplate.banner ? (
                  <RTFBannerImage background={localTemplate.banner}>
                    <RTFTitleField>{localTemplate.title}</RTFTitleField>
                  </RTFBannerImage>
                ) : (
                  <RTFFormBanner>
                    <RTFTitleField>{localTemplate.title}</RTFTitleField>
                  </RTFFormBanner>
                )}
              </div>
            ) : (
              <React.Fragment>
                {localTemplate.title ? (
                  <RTFFormBannerDefault
                    elevation={3}
                    bg={localTemplate.bannercolor}
                  >
                    <RTFTitleField>{localTemplate.title}</RTFTitleField>
                  </RTFFormBannerDefault>
                ) : null}
              </React.Fragment>
            )}
          </div>
          <RTFFormContainer
            background={localTemplate.background}
            style={{
              background: `${localTemplate.backgroundcolor}`,
              height: '100%'
            }}
          >
            {localTemplate &&
            localTemplate.fields &&
            localTemplate.fields.length ? (
              <FieldLevelValidationForm
                data={finalData}
                fields={localTemplate.fields}
                onChange={(key, value, field) =>
                  onValueChanged(key, value, field)
                }
                onAddColumn={onInject}
                controls={controls}
                editable={editable}
                onButtonClick={onButtonClick}
                controlMarker={controlMarker}
              />
            ) : (
              <NoContent
                label='Your components will appear hear'
                subtext='Add new component(s) and re-render'
              />
            )}
          </RTFFormContainer>
        </RTFFormWrapper>
      </Provider>
    </ThemeProvider>
  )
}

export default FormViewer
