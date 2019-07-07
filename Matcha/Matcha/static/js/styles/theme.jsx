import { createMuiTheme } from '@material-ui/core/styles'

const palette = ({
  palette: {
    primary: {
      main: '#ff6c6c'
    },
    secondary: {
      main: '#464476'
    },
    primaryColor: '#ff6c6c',
    // primaryColor: '#ffc300',
    primaryHoverColor: '#d45555',
    // primaryHoverColor: '#d45555',
    backgroundColor: '#fff1d8',
    secondaryColor: '#464476',
    textGreyColor: '#6c6c6c',
    titleGreyColor: '#6f6d6d',
    placeHolderColor: '#b3b3b3',
    blackColor: '#373636',
    emptyContentColor: '#fffaf5',
    greyHoverColor: '#f9f9f9',
    greylightColor: '#e0e0e0'
  },
  status: {
    danger: 'orange',
  },
})

export const theme = createMuiTheme({
  ...palette,
  typography: {
    useNextVariants: true,
  }
})