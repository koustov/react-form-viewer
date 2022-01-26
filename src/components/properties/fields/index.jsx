import * as React from 'react'

import {
  RTFCheckbox,
  RTFFormControlLabel,
  RTFHeaderField,
  RTFLabelField,
  RTFNoContentAvailable,
  RTFTextField
} from 'react-themed-fields'
import { faFilePdf, faImage, faVideo } from '@fortawesome/free-solid-svg-icons'

import RTFRadioControl from './RTFRadio'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import RTFPdfViewer from "./RTFPdfViewer";

const getStyleObject = (style) => {
  const res = {}
  if (style) {
    style.forEach((s) => {
      res[s['name']] = s['value']
    })
  }
  return res
}
export const getFinalField = (
  infield,
  onValueChange,
  invalue,
  label,
  fieldname
) => {
  let resComponent = {}
  const field = Object.assign({}, infield)
  const strFieldName = fieldname ? fieldname : field.datafield
  if (!field.custom) {
    field.custom = {
      style: [],
      props: []
    }
  }

  const value = invalue || field.value

  const localprops = {
    style: getStyleObject(field.custom.style),
    ...field.custom.props
  }
  switch (field.type) {
    // case 'richeditor':
    //   const modules = {
    //     toolbar: [
    //       [{ header: [1, 2, false] }],
    //       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //       [
    //         { list: 'ordered' },
    //         { list: 'bullet' },
    //         { indent: '-1' },
    //         { indent: '+1' }
    //       ],
    //       ['clean']
    //     ]
    //   }
    //   const formats = [
    //     'header',
    //     'bold',
    //     'italic',
    //     'underline',
    //     'strike',
    //     'blockquote',
    //     'list',
    //     'bullet',
    //     'indent'
    //   ]
    //   resComponent = (
    //     <RTFRichTextEditor
    //       value={value}
    //       theme={'snow'}
    //       placeholder={field.placeholder}
    //       modules={modules}
    //       formats={formats}
    //       bounds={'.app'}
    //       onChange={(e) => {
    //         if (onValueChange) {
    //           onValueChange(strFieldName, e, field)
    //         }
    //       }}
    //     />
    //   )
    //   break
    case 'text':
      resComponent = (
        <RTFTextField
          id={`text-field-${strFieldName}`}
          label={`${label || field.label}`}
          value={value}
          onChange={(e) => {
            if (onValueChange) {
              onValueChange(strFieldName, e.target.value, field)
            }
          }}
          type={field.subtype || 'text'}
          fullWidth
          size='small'
          variant='outlined'
          {...localprops}
        />
      )
      break
    case 'divider':
      resComponent = <hr className='MuiDivider-root' {...localprops} />
      break
    case 'header':
      resComponent = (
        <RTFHeaderField {...localprops}>{label || field.label}</RTFHeaderField>
      )
      break
    case 'label':
      resComponent = (
        <RTFLabelField
          dangerouslySetInnerHTML={{ __html: label || field.label }}
          {...localprops}
        ></RTFLabelField>
      )
      break
    case 'radio':
      resComponent = (
        <RTFRadioControl
          onChange={(fld, val, fielddata) => {
            if (onValueChange) {
              onValueChange(fld, val, fielddata)
            }
          }}
          field={field}
          rows={value && value.length ? value : []}
          {...localprops}
        ></RTFRadioControl>
      )
      break
    case 'checkbox':
      resComponent = (
        <div>
          <RTFFormControlLabel
            control={
              <RTFCheckbox
                checked={value}
                onChange={(e) => {
                  if (onValueChange) {
                    onValueChange(strFieldName, e.target.checked, field)
                  }
                }}
                name='checkedB'
                {...localprops}
              />
            }
            label={`${label || field.label}`}
          ></RTFFormControlLabel>
        </div>
      )
    case 'textarea':
      resComponent = (
        <RTFTextField
          label={`${label || field.label}`}
          multiline
          value={value}
          onChange={(e) => {
            if (onValueChange) {
              onValueChange(strFieldName, e.target.value, field)
            }
          }}
          fullWidth
          size='small'
          variant='outlined'
          {...localprops}
        />
      )
      break

    case 'image':
      resComponent = (
        <React.Fragment>
          {value && value.length ? (
            <React.Fragment>
              {value.map((f, fi) => {
                return (
                  <div key={fi}>
                    <img src={`${f}`} alt={f} {...localprops}></img>
                  </div>
                )
              })}
            </React.Fragment>
          ) : (
            <RTFNoContentAvailable>
              <div>
                <FontAwesomeIcon icon={faImage} />
              </div>
              <div>NO IMAGE SELECTED</div>
            </RTFNoContentAvailable>
          )}
        </React.Fragment>
      )
      break
    // case "pdf": resComponent = (
    //   <React.Fragment>
    //     {value ? (<RTFPdfViewer value={value} />) : (
    //       <RTFNoContentAvailable>
    //         <div><FontAwesomeIcon icon={faFilePdf} /></div>
    //         <div >NO PDF FILE SELECTED</div>
    //       </RTFNoContentAvailable>
    //     )}
    //   </React.Fragment>

    // )
    //   break;

    default:
      resComponent = <React.Fragment></React.Fragment>
  }
  return resComponent
}
