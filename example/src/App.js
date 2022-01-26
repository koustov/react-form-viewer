import * as React from 'react'

import FormViewer from 'react-form-viewer'
import { ThemeProvider } from 'styled-components'
import { Themes } from './themes'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { DefaultTemplate } from './default-template'

import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const App = () => {
  const [template, setTemplate] = React.useState(DefaultTemplate)
  const [themeName, setThemeName] = React.useState('dark')
  const [data, setData] = React.useState({
    'F_89186732-19d3-4271-b133-ed92757cb17': true
  })
  const [formState, setFormState] = React.useState(DefaultTemplate)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleChange = (event, newAlignment) => {
    setThemeName(newAlignment)
  }
  return (
    <ThemeProvider theme={Themes[themeName]}>
      <div className='container' style={{ boxSizing: 'border-box' }}>
        <div style={{ padding: '1rem', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontWeight: 100 }}>React Form Viewer</h1>
          </div>
          <div>
            <div>
              <Button onClick={handleOpen}>Preview</Button>
              <ToggleButtonGroup
                color='primary'
                value={'web'}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton
                  value='glass'
                  style={{
                    color: `${themeName === 'glass' ? 'yellow' : '#ABABAB'}`
                  }}
                >
                  Glass
                </ToggleButton>
                <ToggleButton
                  value='light'
                  style={{
                    color: `${themeName === 'light' ? 'yellow' : '#ABABAB'}`
                  }}
                >
                  Light
                </ToggleButton>
                <ToggleButton
                  value='dark'
                  style={{
                    color: `${themeName === 'dark' ? 'yellow' : '#ABABAB'}`
                  }}
                >
                  Dark
                </ToggleButton>
                <ToggleButton
                  value='chalk'
                  style={{
                    color: `${themeName === 'chalk' ? 'yellow' : '#ABABAB'}`
                  }}
                >
                  Chalk
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div>
              {' '}
              <a
                href='https://www.npmjs.com/package/react-form-viewer'
                target='_blank'
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  marginRight: '8px'
                }}
              >
                🔘 NPM
              </a>
              <a
                href='https://github.com/koustov/react-form-viewer'
                target='_blank'
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  marginRight: '8px'
                }}
              >
                🔘 GIT
              </a>
              <a
                href='https://codesandbox.io/s/react-form-builder-react-form-viewer-smw51'
                target='_blank'
                style={{
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  marginRight: '8px'
                }}
              >
                🔘 CodeSandbox
              </a>
            </div>
          </div>
        </div>
        <FormViewer
          id='example-form'
          baseTheme={'dark'}
          themeOverride={Themes[themeName]}
          onChange={(k, v, c) => {
            // data[k] = v
            // setData(data)
            console.log('Form data changed')
            console.log(JSON.stringify(data))
          }}
          onControlValueChanged={(k, v, f) => {
            console.log('Control data changed')
            data[k] = v
            setData(data)
            console.log(`Field: ${k} Value: ${v} Field: ${JSON.stringify(f)}`)
          }}
          data={data}
          template={formState}
        />
      </div>
    </ThemeProvider>
  )
}
export default App
