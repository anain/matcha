import { connect } from 'react-redux'
import withTheme from '@material-ui/core/styles/withTheme'
import withStyles from '@material-ui/core/styles/withStyles'
import { compose } from 'recompose'
import { withRouter } from 'react-router'
import { withSnackbar } from 'notistack'

export default classes => (mapStateToProps, mapDispatchToProps, mergeProps, options) => Component => {
  Component=withRouter(Component)
  Component=withSnackbar(Component)
  if (mapStateToProps || mapDispatchToProps) {
    Component = connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(Component)
  }
  if (classes) {
    Component = compose(
        withTheme(),
        withStyles(classes)
    )(Component)
  }
  return Component
}
