import React from 'react'
import TopMenuNavigationBar from './topMenuNavigationBar'
import Wrapper from '../Wrapper'
import AsyncComponent from '../../AsyncComponent'

const styles = (theme) => {
  return {
      background: {
          backgroundColor: theme.palette.backgroundColor,
      }
  }
}

const PageContainer = ({classes, content}) => {
    return (
      <div className={`flex column fullWidth fullHeight ${classes.background}`} >
        <div>
          <TopMenuNavigationBar />
        </div>
        <div className={`flex column alignCenter fullHeight`}>
          <AsyncComponent moduleProvider={content}/>
        </div>
      </div>
    )
}

export default Wrapper(styles)()(PageContainer)
