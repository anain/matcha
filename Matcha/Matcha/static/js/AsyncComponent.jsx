import React, { PureComponent } from 'react'
import BounceLoader from 'react-spinners/BounceLoader'

export default class AsyncComponent extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      Component: null
    }
  }

  componentDidMount() {
    this.mount = true
    if(!this.state.Component) {
      this.props.moduleProvider().then((Component) => 
			{
        if (this.mount){
          this.setState({ Component: Component.default })
        }
			})
    }
  }

  componentWillUnmount() {
    this.mount = false
  }

  render() {
    const { Component } = this.state
    const { container, ...props } = this.props
    return (
      <div className={`fullWidth fullHeight`}>
        {Component
						? <Component {...props}/>
            : <div className={`relative fullWidth fullHeight flex center alignCenter`}>
                <BounceLoader sizeUnit={'px'}
                size={100}
                color={'#ff6c6c'}
                loading
              />
            </div>
        }
      </div>
    )
  }
}