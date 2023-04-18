import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ChartistGraph from 'react-chartist';
import { dateToKey } from '../../shared/calcDuration';

export function SiteActivityPage(props) {
  const site = props.siteMap[props.activitySiteId]
  const dates = []
  const durations = []

  if (site) {
    let curDate = new Date()

    for (let i = 0; i < 7; i++) {
      const curKey = dateToKey(curDate)
      const value = props.sessionMap[props.activitySiteId]?.[curKey]

      dates.unshift(curKey.split('/').slice(0, 2).join('/'))
      durations.unshift(value ? Math.floor(value / (1000 * 60)) : undefined)

      curDate.setDate(curDate.getDate() - 1)
    }
  }

  const data = {
    labels: dates,
    series: [durations]
  };

  const options = {
    width: 350,
    height: 300
  }

  var type = 'LineChart'

  return (
    <>
      <IconButton onClick={props.closePage}>
        <ArrowBackIcon />
      </IconButton>

      {
        Boolean(site) &&
        <>
          <div className="activityTitle">
            <Typography variant="h5" gutterBottom>{site.name}</Typography>
            <div className="activitySub">
              <Typography variant="overline" display="block" gutterBottom>{site.domain}</Typography>
            </div>
          </div>

          <ChartistGraph data={data} options={options} type={type} />
        </>
      }
    </>
  )
}