import React from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { PopupConfigureSite } from '../components/PopupConfigureSite';
import { TableWrapper } from '../components/TableWrapper';
import { ADDED_BY_USER_START_ID } from '../../shared/storageState';
import { PopupConfirm } from '../components/PopupConfirm'
import { IconButton } from '../components/IconButton';

export function SettingsPage(props) {
  const [showAddNewSitePopup, setShowAddNewSitePopup] = React.useState(false)

  const [editSiteId, setEditSiteId] = React.useState(false)
  const showEditSitePopup = Boolean(editSiteId)

  const [deleteSiteId, setDeleteSiteId] = React.useState(null)
  const showDeleteSitePopup = Boolean(deleteSiteId)

  const handleAddSite = (name, domain) => {
    props.handleAddSite(name, domain)
    setShowAddNewSitePopup(false)
  }

  const handleEditSite = (name, domain) => {
    props.handleEditSite(editSiteId, name, domain)
    setEditSiteId(null)
  }


  const handleDeleteSite = (shouldDelete) => {
    if (shouldDelete) {
      props.handleDeleteSite(deleteSiteId)
    }

    setDeleteSiteId(null)
  }

  return (
    <>
      {
        showAddNewSitePopup &&
        <PopupConfigureSite
          title="🪄 Add New Site"
          buttonText="Add"
          addSite={(name, domain) => handleAddSite(name, domain)}
          onClose={() => setShowAddNewSitePopup(false)}
        />
      }

      {
        showEditSitePopup &&
        <PopupConfigureSite
          title="🪄 Edit Site"
          buttonText="Save"
          initialNameValue={props.siteMap[editSiteId].name}
          initialDomainValue={props.siteMap[editSiteId].domain}
          addSite={(name, domain) => handleEditSite(name, domain)}
          onClose={() => setEditSiteId(null)}
        />
      }

      {
        showDeleteSitePopup &&
        <PopupConfirm
          text={`⚠️ Are you sure you want to delete ${props.siteMap[deleteSiteId].name} from your list?`}
          onAccept={() => handleDeleteSite(true)}
          onReject={() => handleDeleteSite(false)}
        />
      }

      <TableWrapper
        head={['Site name', 'Set Time (mins)', null, null]}
        rows={Object.keys(props.siteMap)
          .filter((siteId) => props.siteMap[siteId].status)
          .map((siteId) => {
            const site = props.siteMap[siteId]
            const isAddedByUserSite = parseInt(siteId) >= ADDED_BY_USER_START_ID

            return [
              site.name ?? site.domain,
              <TextField
                sx={{ width: '60px' }}
                hiddenLabel
                type="number"
                size="small"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                value={props.siteMap[siteId].maxDurationInMins}
                onChange={e => props.handleMaxDurationInMinsChange(siteId, e.target.value)}
                placeholder="Add duration in minutes 30"
              />,
              isAddedByUserSite && <IconButton onClick={() => setEditSiteId(siteId)} text="✏️" styles={{ fontSize: 20 }} />,
              isAddedByUserSite && <IconButton onClick={() => setDeleteSiteId(siteId)} text="🗑" styles={{ fontSize: 20 }} />
            ]
          })
        }
      />

      <div className="button">
        <Button variant="outlined" onClick={() => setShowAddNewSitePopup(true)}>Add New Site</Button>
      </div>
    </>
  )
}