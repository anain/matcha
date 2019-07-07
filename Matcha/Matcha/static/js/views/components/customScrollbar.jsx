import React from 'react'
import Wrapper from '../Wrapper'
import { Scrollbars } from 'react-custom-scrollbars'

class CustomScrollbar extends React.Component {
    constructor (props) {
			super(props)
			this.handleAboutToReachBottom = this.handleAboutToReachBottom.bind(this)
			this.handleUpdate = this.handleUpdate.bind(this)
			this.state = {
			}
		}

    handleUpdate(values) {
      const { scrollTop, scrollHeight, clientHeight } = values
      const pad = 100 // 100px of the bottom
      const t = ((scrollTop + pad) / (scrollHeight - clientHeight))
      if (t > 1) this.handleAboutToReachBottom()
    }

    render() {
      return <Scrollbars onUpdate={this.handleUpdate}/>
    }
}

export default Wrapper()()(CustomScrollbar)