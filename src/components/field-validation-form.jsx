import {
  RTFControlEdit,
  RTFFormRow,
  RTFToolButton,
  RTFFlannerWrapper,
  RTFDrawer,
  RTFPaperVerticalPadding,
  RTFSquareActionButton,
  RTFDivider,
  RTFFormColumn,
  RTFGridHeaderRow,
  RTFHeaderField,
  RTFDataGridView,
  RTFFileUploadField,
  RTFFormCheckboxField,
  RTFFormNonField,
  RTFFormRadioField,
  RTFFormSelectField,
  RTFFormTextAreaField,
  RTFFormTextField,
  RTFFormDateField,
  RTFFormDateTimeField,
  RTFQuestionField,
  RTFImageloadField,
  RTFFormColorField,
  RTFFormStyleField
} from 'react-themed-fields'
import { Field, reduxForm } from 'redux-form'
import React, { Fragment, useEffect, useState } from 'react'
import {
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faClone,
  faPenAlt,
  faTrashAlt,
  faPen,
  faPlus,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons'
import { Button, Grid } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ValidationMap = {
  required: (value) => (value ? undefined : 'Required'),
  maxLength: (max) => (value) =>
    value && value.length > max
      ? `Must be ${max} characters or less`
      : undefined,
  number: (value) =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined,
  minValue: (min) => (value) =>
    value && value < min ? `Must be at least ${min}` : undefined,
  email: (value) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? 'Invalid email address'
      : undefined,
  tooOld: (value) =>
    value && value > 65 ? 'You might be too old for this' : undefined,
  aol: (value) =>
    value && /.+@aol\.com/.test(value)
      ? 'Really? You still use AOL for your email?'
      : undefined
}
const renderSwitch = (type) => {
  switch (type) {
    case 'text':
      return RTFFormTextField
    case 'date':
    case 'time':
      return RTFFormDateField
    case 'datetime':
      return RTFFormDateTimeField
    case 'select':
      return RTFFormSelectField
    case 'radio':
      return RTFFormRadioField
    case 'textarea':
      return RTFFormTextAreaField
    case 'checkbox':
      return RTFFormCheckboxField
    case 'grid':
      return RTFDataGridView
    case 'question':
      return RTFQuestionField
    case 'fileupload':
      return RTFFileUploadField
    case 'imageupload':
      return RTFImageloadField
    case 'color':
      return RTFFormColorField
    case 'styleeditor':
      return RTFFormStyleField
    default:
      return 'foo'
  }
}

const validate = (values, props) => {
  const errors = {}
  // if (!values.username) {
  //   errors.username = 'Required'
  // }
  // if (!values.password) {
  //   errors.password = 'Required'
  // }
  return errors
}

const asyncValidate = (values, dis, props) => {
  return sleep(1000).then(() => {
    // simulate server latency
    if (['john', 'paul', 'george', 'ringo'].includes(values.username)) {
      throw { username: 'That username is taken' }
    }
  })
}

const FieldLevelValidationForm = ({
  data,
  fields,
  onChange,
  theme,
  controls,
  onAddColumn,
  plannerConfig,
  controlMarker = {},
  ...props
}) => {
  const { handleSubmit, pristine, reset, submitting } = props
  const [controlsState, setControlsSet] = useState({})
  const [localFields, setLocalFields] = useState([])
  const [selectedIndices, setSelectedIndices] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addAdditional, setAddAdditional] = useState('')

  useEffect(() => {
    const res = {}
    setLocalFields(JSON.parse(JSON.stringify(fields)))
    fields.forEach((fldRow) => {
      fldRow.forEach((fld) => {
        if (fld.datafield && data[fld.datafield] !== undefined) {
          res[fld.datafield] = data[fld.datafield]
        }
      })
    })
    setControlsSet({ ...res })
  }, [fields, data])

  const onValueChanged = (key, value, field) => {
    controlsState[key] = value
    setControlsSet({ ...controlsState })
    if (onChange) {
      onChange(key, value, field)
    }
  }
  const getValidations = (field) => {
    const res = []
    if (field.validations && field.validations.length) {
      Object.keys(field.validations).forEach((k) => {
        if (ValidationMap[k]) {
          res.push(ValidationMap[k])
        }
      })
    }
    return res
  }

  const onActionButtonClick = (type, row, column, e, closeDrawer) => {
    e.preventDefault()
    e.stopPropagation()
    if (closeDrawer) {
      setDrawerOpen(false)
    }
    if (props.onButtonClick) {
      props.onButtonClick(type, row, column)
    }
  }

  const onMoreClick = (row, column, columncount, rowcount) => {
    setSelectedIndices({
      rowIndex: row,
      columnIndex: column,
      columnCount: columncount,
      rowCount: rowcount
    })
    setDrawerOpen(true)
  }

  const getSelectedLabel = () => {
    if (selectedIndices.rowIndex > -1 && selectedIndices.columnIndex > -1) {
      try {
        return localFields[selectedIndices.rowIndex][
          selectedIndices.columnIndex
        ].label
      } catch {}
    }
    return ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ flex: 1 }}>
        <RTFFlannerWrapper container spacing={1}>
          <React.Fragment>
            {localFields.map((fldrow, fldrowi) => {
              return (
                <Grid
                  container
                  // spacing={{ xs: 2, md: 3 }}
                  // columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {/* <div  style={{ width: '100%', display: 'flex' }}> */}
                  {fldrow.map((fld, fldi) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={fldrow.length > 1 ? 6 : 12}
                        md={
                          fldrow.length > 1 ? (fldrow.length < 3 ? 6 : 4) : 12
                        }
                        lg={fldrow.length > 1 ? 12 / fldrow.length : 12}
                        key={`${fldrowi}-${fldi}`}
                      >
                        {/* <div
                        style={{ width: '100%', padding: '4px' }}
                        key={`${fldrowi}-${fldi}`}
                      > */}
                        {fld.visible !== false ? (
                          <RTFFormRow
                            editable={props.editable}
                            bordered={fld.bordered}
                          >
                            <RTFFormColumn
                              editable={props.editable}
                              selected={
                                selectedIndices.rowIndex === fldrowi &&
                                selectedIndices.columnIndex === fldi
                              }
                              className='element-wrapper'
                            >
                              {fld.datafield ? (
                                <Field
                                  name={fld.datafield}
                                  component={renderSwitch(fld.type)}
                                  field={fld}
                                  themeOverride={theme}
                                  required={
                                    fld.validations && fld.validations.required
                                  }
                                  inputvalue={controlsState[fld.datafield]}
                                  allvalue={controlsState}
                                  onValueChanged={(key, value) =>
                                    onValueChanged(key, value, fld)
                                  }
                                  editable={props.editable}
                                  input={{
                                    value: controlsState[fld.datafield]
                                  }}
                                  {...props}
                                />
                              ) : (
                                <RTFFormNonField field={fld} />
                              )}{' '}
                            </RTFFormColumn>
                            <RTFControlEdit
                              className='control-edit-overlay'
                              {...{
                                selected: props.selectedControlIndex === fldrowi
                              }}
                              key={`${fldrowi}-${fldi}`}
                            >
                              <div className='content-details action-button-wrapper fadeIn-bottom'>
                                {props.editable ? (
                                  <Fragment>
                                    <RTFToolButton
                                      variant='contained'
                                      size='small'
                                      aria-label='clone'
                                      onMouseEnter={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                      onClick={(e) =>
                                        onActionButtonClick(
                                          'ed',
                                          fldrowi,
                                          fldi,
                                          e
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faPenAlt} />
                                    </RTFToolButton>
                                    <RTFToolButton
                                      variant='contained'
                                      color='secondary'
                                      size='small'
                                      aria-label='delete'
                                      onMouseEnter={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                      onClick={(e) =>
                                        onActionButtonClick(
                                          'rm',
                                          fldrowi,
                                          fldi,
                                          e
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </RTFToolButton>
                                    <RTFToolButton
                                      variant='contained'
                                      size='small'
                                      aria-label='more'
                                      onMouseEnter={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                      onClick={(e) =>
                                        onMoreClick(
                                          fldrowi,
                                          fldi,
                                          fldrow.length,
                                          localFields.length
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faEllipsisH} />
                                    </RTFToolButton>
                                  </Fragment>
                                ) : null}
                              </div>
                            </RTFControlEdit>
                          </RTFFormRow>
                        ) : (
                          <div></div>
                        )}
                      </Grid>
                    )
                  })}
                </Grid>
              )
            })}
          </React.Fragment>
        </RTFFlannerWrapper>
      </div>
      <RTFDrawer
        anchor={'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerOpen ? (
          <RTFPaperVerticalPadding>
            <RTFHeaderField>More Option: {getSelectedLabel()}</RTFHeaderField>
            <RTFDivider />
            <div style={{ display: 'flex' }}>
              <RTFSquareActionButton
                onClick={(e) =>
                  onActionButtonClick(
                    'ed',
                    selectedIndices.rowIndex,
                    selectedIndices.columnIndex,
                    e,
                    true
                  )
                }
              >
                <div>
                  <FontAwesomeIcon icon={faPen} />
                </div>
                <div>Edit</div>
              </RTFSquareActionButton>
              <RTFSquareActionButton
                onClick={(e) =>
                  onActionButtonClick(
                    'cl',
                    selectedIndices.rowIndex,
                    selectedIndices.columnIndex,
                    e,
                    true
                  )
                }
              >
                <div>
                  <FontAwesomeIcon icon={faClone} />
                </div>
                <div>Clone</div>
              </RTFSquareActionButton>
            </div>
            <div style={{ display: 'flex' }}>
              <RTFSquareActionButton
                disabled={selectedIndices.rowIndex === 0}
                onClick={(e) => {
                  setSelectedIndices({
                    ...selectedIndices,
                    rowIndex: selectedIndices.rowIndex + -1
                  })
                  onActionButtonClick(
                    'mu',
                    selectedIndices.rowIndex,
                    selectedIndices.columnIndex,
                    e,
                    false
                  )
                }}
              >
                <div>
                  <FontAwesomeIcon icon={faChevronUp} />
                </div>
                <div>Move Up Row</div>
              </RTFSquareActionButton>
              <RTFSquareActionButton
                disabled={
                  selectedIndices.rowIndex === selectedIndices.rowCount - 1
                }
                onClick={(e) => {
                  setSelectedIndices({
                    ...selectedIndices,
                    rowIndex: selectedIndices.rowIndex + 1
                  })
                  onActionButtonClick(
                    'md',
                    selectedIndices.rowIndex,
                    selectedIndices.columnIndex,
                    e,
                    false
                  )
                }}
              >
                <div>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
                <div>Move Down Row</div>
              </RTFSquareActionButton>
              <RTFSquareActionButton
                disabled={selectedIndices.columnIndex === 0}
                onClick={(e) => {
                  setSelectedIndices({
                    ...selectedIndices,
                    columnIndex: selectedIndices.columnIndex - 1
                  })
                  onActionButtonClick(
                    'ml',
                    selectedIndices.rowIndex,
                    selectedIndices.columnIndex,
                    e,
                    false
                  )
                }}
              >
                <div>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                <div>Move Left Column</div>
              </RTFSquareActionButton>
              <RTFSquareActionButton
                disabled={
                  selectedIndices.columnIndex ===
                  selectedIndices.columnCount - 1
                }
                onClick={(e) => {
                  setSelectedIndices({
                    ...selectedIndices,
                    columnIndex: selectedIndices.columnIndex + 1
                  })
                  onActionButtonClick(
                    'mr',
                    selectedIndices.rowIndex,
                    selectedIndices.columnIndex,
                    e,
                    false
                  )
                }}
              >
                <div>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
                <div>Move Right Column</div>
              </RTFSquareActionButton>
            </div>

            <RTFHeaderField>Add new column</RTFHeaderField>
            <RTFDivider />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gridGap: '8px'
              }}
            >
              {Object.keys(controls).map((k, ki) => {
                return (
                  <React.Fragment key={ki}>
                    {controls[k].map((c, ci) => {
                      return (
                        <RTFSquareActionButton
                          key={`${ki}-${ci}`}
                          onClick={() => {
                            setDrawerOpen(false)
                            if (onAddColumn)
                              onAddColumn(c, selectedIndices.rowIndex)
                          }}
                        >
                          <div>
                            <FontAwesomeIcon icon={c.icon} />
                          </div>
                          <div>{c.display}</div>
                        </RTFSquareActionButton>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </div>
          </RTFPaperVerticalPadding>
        ) : null}
      </RTFDrawer>
    </form>
  )
}

export default reduxForm({
  form: 'fieldLevelValidation', // a unique identifier for this form
  validate,
  // asyncValidate,
  destroyOnUnmount: true,
  enableReinitialize: true,
  touchOnChange: true,
  trigger: 'blur'
})(FieldLevelValidationForm)
