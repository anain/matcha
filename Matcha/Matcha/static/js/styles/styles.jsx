import { theme } from './theme'
export const style = ({
  defaults: {
    bigTitle: {
      color: 'red',
      fontSize: '32px'
    }
  },
  navBar: {
    container: {
			backgroundColor: theme.palette.primaryColor,
			height: '75px'
    },
    emptyNotif: {
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: '18px',
      outline: 'none',
      color: 'grey',
    },
		logoLabelStyle: {
			fontSize: '30px',
			fontStyle: 'Black',
			color: theme.palette.primaryHoverColor,
			fontWeight: '800'
		},
		iconStyle: {
			color: '#ffffff',
			width: '50px',
			height: '50px',
			cursor: 'pointer',
			padding: '0px 5px',
			'&:hover': {
				color: theme.palette.primaryHoverColor
			}
		},
		paper: {
      top: '75px !important',
		},
		menuItemRoot: {
			whiteSpace: 'inherit',
			height: 'inherit',
			justifyContent: 'space-around',
			padding: 0,
			minHeight: '60px'
		},
		pictureStyle: {
			width: '50px',
			height: '50px',
			borderRadius: '100px'
		},
		iconPicture: {
			cursor: 'pointer',
			width: '54px',
			height: '54px',
			backgroundColor: 'white',
			borderRadius: '100px',
			marginRight: '15px',
			'&:hover': {
				backgroundColor: theme.palette.primaryHoverColor
      }
    }
  },
  messages: {
    chatListContainer: {
      backgroundColor: '#ffffff',
    },
    chatListUserContainer: {
      height: '50px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.greyHoverColor
      },
      '&:active': {
        backgroundColor: '#f5f5f5'
      }
    },
    mobileChatListContainer: {
      height: '75px',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.greyHoverColor
      },
      '&:active': {
        backgroundColor: '#f5f5f5'
      }
    },
    contactLabel: {
      width: '100px',
      display: 'block',
      fontSize: '18px',
      marginLeft: '10px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
      color: theme.palette.titleGreyColor
    },
    profilePicture: {
      minWidth: '40px',
      minHeight: '40px',
      maxHeight: '40px',
      maxWidth: '40px',
      width: '100%',
      height: '100%',
      borderRadius: '40px',
      marginLeft: '10px'
    },
    mobilePicture: {
      minWidth: '60px',
      minHeight: '60px',
      maxHeight: '60px',
      maxWidth: '60px',
      width: '100%',
      height: '100%',
      borderRadius: '60px',
      marginLeft: '20px'
    },
    chatListTitleLabel: {
      fontSize: '24px',
      color: theme.palette.titleGreyColor,
      height: '60px',
      left: '20px'
    },
    bubbleContainer: {
      padding: '5px',
    },
    bubbleCurrentUser: {
      position: 'relative',
      alignSelf: 'flex-end',
      maxWidth: '80%',
      width: 'fitContent',
      padding: '10px 15px',
      wordBreak: 'break-all',
      backgroundColor: theme.palette.primaryColor,
      color: 'white',
      borderRadius: '15px',
      boxShadow: '1px 1px lightblue',
    },
    bubbleAnswer: {
      boxShadow: '1px 1px lightblue',
      position: 'relative',
      alignSelf: 'flex-start',
      maxWidth: '80%',
      padding: '10px 15px',
      wordBreak: 'break-all',
      backgroundColor: 'white',
      borderRadius: '15px',
      color: 'black'
    },
    chatTitle: {
      height: '60px',
      fontSize: '19px',
      backgroundColor: '#ffffff',
      color: theme.palette.titleGreyColor,
      fontWeight: 200,
      margin: 0
    },
    titleContactName: {
      paddingLeft: '25px',
      fontWeight: 400,
      color: theme.palette.blackColor
    },
    answerLabel: {
      color: theme.palette.textGreyColor, 
      paddingLeft: '15px',
      fontSize: '15px',
      border: 'none'
    },
    writeAnswerContainer: {
      cursor: 'text',
      height: '40px',
      borderRadius: '40px',
    },
    borderSecondary: {
      border: `2px solid ${theme.palette.greyHoverColor}`,
      transition: '300ms'
    },
    borderPrimary: {
      border: `2px solid ${theme.palette.primaryColor}`,
      transition: '300ms'
    },
    sendSecondary: {
      color: theme.palette.placeHolderColor,
      transition: '300ms'
    },
    sendPrimary: {
      color: theme.palette.primaryColor,
      transition: '300ms'
    },
    sendIcon: {
      width: '30px',
      height: '30px',
      position: 'relative',
      right: '10px',
      cursor: 'pointer',
      '&:active': {
        color: theme.palette.primaryHoverColor
      }
    }
  },
  profilPage: {
    tag: {
			margin: '8px 5px',
			height: '20px',
			border: `1px solid ${theme.palette.primaryColor}`,
			borderRadius: '5px',
			cursor: 'pointer',
			minWidth: '50px',
			padding: '0px 5px',
		},
		tagLabel: {
			fontSize: '16px',
			fontWeight: 800,
			color: theme.palette.primaryColor,
			textAlign: 'center'
    },
		noTagsBox: {
			minHeight: '70px',
			borderRadius: '20px',
			backgroundColor: 'white',
			color: 'lightgrey',
			border: '1px solid lightgrey',
			padding: '10px 0px',
			marginBottom: '20px',
		},
    likeBoxText: {
      fontSize: '25px',
      fontWeight: '100',
      color: theme.palette.primaryColor,
      textAlign: 'center'
    },
    openPhotoContainer: {
      width: '100%',
      height: '100vh',
      top: '0px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: '100'
    },
    resume: {
      border: `0.5px solid ${theme.palette.greylightColor}`,
      borderRadius: '10px',
      padding: '20px'
    },
    resumeTextSection: {
      fontSize: '18px',
      fontWeight: '500',
      color: theme.palette.primaryColor
    },
    resumeTextAnswer: {
      textOverflow: 'ellipsis',
      padding: '0px 8px',
      fontSize: '18px',
      color: theme.palette.textGreyColor
    },
    photosContainer: {
      border: `0.5px solid ${theme.palette.greylightColor}`,
      borderRadius: '10px',
      marginTop: '20px',
      overflow: 'scroll',
      maxHeight: '300px'
    },
    resumeSection: {
      padding: '5px',
      textOverflow: 'ellipsis',
    },
    likeBox: {
      border: `0.5px solid ${theme.palette.primaryColor}`,
      height: '150px',
      borderRadius: '10px'
    },
    boxInfos: {
      marginTop: '15px',
      color: theme.palette.primaryColor,
      padding: '10px 5px',
      margin: '15px 20px'
    },
    defaultButton: {
      color: '#ffffff',
      backgroundColor: theme.palette.primaryRedColor
    },
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '5px',
      padding: '20px 30px 30px 30px'
    },
    title: {
      fontSize: '25px',
      fontWeight: '200',
      color: theme.palette.blackColor
    },
    subtitle: {
      fontWeight: 200,
      fontSize: '18px',
      maxWidth: '350px',
      color: theme.palette.textGreyColor
    },
    heartIcon: {
      width: '50px',
      height: '50px',
      color: theme.palette.primaryColor,
      left: '17px',
      cursor: 'pointer',
      marginTop: '5px',
      marginLeft: '10px',
      '&:hover': {
        color: theme.palette.primaryHoverColor
      }
    },
    statusIcon: {
      color: theme.palette.placeHolderColor,
      width: '20px',
      height: '20px',
      paddingRight: '15px'
    },
    locationIcon: {
      width: '30px',
      height: '30px',
      color: theme.palette.titleGreyColor
    },
    starIcon: {
      width: '40px',
      height: '40px',
      color: theme.palette.primaryColor
    },
    nbStarLabel: {
      marginTop: '5px',
      marginLeft: '5px',
      color: theme.palette.titleGreyColor
    },
    locationLabel: {
      color: theme.palette.placeHolderColor
    },
    moreIcon: {
      cursor: 'pointer',
      marginRight: '15px',
      width: '30px',
      height: '30px',
      color: theme.palette.titleGreyColor
    },
    photoContainer: {
      backgroundColor: theme.palette.emptyContentColor,
      borderRadius: '15px',
      marginTop: '25px',
      width: '85%',
      marginBottom: '10px',
      overflow: 'hidden',
      height: '200px'
    },
    userPhotos: {
      maxWidth: '265px',
      maxHeight: '265px',
      width: '100%',
      height: '100%'
    },
    hover: {
      '&:hover': {
        opacity: '0.8',
        cursor: 'pointer'
      }
    }
  },
  welcomePage: {
    container: {
			backgroundColor: theme.palette.emptyContentColor,
		},
		oval: {
			backgroundColor: theme.palette.primaryColor,
			left: '0%',
			width: '67%',
			top: '-400px',
			height: '2000px',
			borderRadius: '0% 57% 57% 0%'
		},
		loginBox: {
			position: 'relative',
			top: '20%',
			borderRadius: '10px',
			marginRight: '15px',
			width: '90%',
			maxHeight: '700px',
			minHeight: '100%px',
			height: '800px',
			backgroundColor: '#ffffff',
			boxShadow: '10px 5px 5px lightgrey',
			overflow: 'hidden',
			zIndex: 20,
			maxWidth: '710px'
		},
		notSelected: {
			width: '50%',
			height: '100%',
			fontSize: '25px',
			borderRadius: '10px',
			color: theme.palette.titleGreyColor
		},
		isSelected: {
			height: '100%',
			width: '50%',
			fontSize: '25px',
			backgroundColor: theme.palette.secondaryColor,
			borderRadius: '10px 10px 0px 0px',
			fontWeight: '300',
			color: '#ffffff'
		},
		loginBoxNavbar: {
			height: '60px',
			cursor: 'pointer'
		},
		picture: {
			backgroundColor: 'white',
			zIndex: 1,
			height: '600px',
			width: '700px',
			position: 'relative'
		},
		pictureText: {
			position: 'absolute',
			zIndex: 10,
			top: '-15%',
			fontSize: '60px',
			width: '125%',
			fontWeight: 500,
			color: '#ffffff',
			position: 'relative',
			bottom: '5%'
		},
		pictureSubtext: {
			position: 'absolute',
			zIndex: 10,
			top: '-10%',
			fontWeight: 100,
			marginLeft: '20px',
			fontSize: '40px',
			color: '#ffffff',
			position: 'relative',
			bottom: '5%'
		},
		inputLabel: {
			// width: '65%',
			fontSize: '18px',
			color: theme.palette.textGreyColor
		}
  },
  matchPage: {
    titleSection: {
      width: '100%',
      height: '50px',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: theme.palette.primaryColor
    },
    advancedSearchContainer: {
      backgroundColor: '#ffffff'
    },
    searchResultContainer: {
      backgroundColor: '#ffffff'
    },
    formGroupRoot: {
      justifyContent: 'center',
      height: '100%'
    },
    profileCard: {
      height: '20wh',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'lightgrey'
      }
    },
    profileCardPicture: {
      padding: '10px 0px',
      height: '150px',
      width: '150px'
		},
		slider: {
			marginLeft: '10px'
		},
		rangeLabel: {
      textAlign: 'center',
      padding: '20px',
      color: theme.palette.textGreyColor,
      minWidth: '20px',
      maxWidth: '20px'
		},
		sectionLabel: {
      fontWeight: 'bold',
      fontSize: '18px',
      padding: '20px',
      color: theme.palette.primaryColor,
		}
  },
  editionMode: {
    editIco: {
			display: 'none',
      color: 'white',
      position: 'relative',
      top: '3px'
    },
    ico: {
      heigth: '25px',
			width: '25px'
    },
    editText: {
      '&:hover': {
        backgroundColor: 'lightgrey',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '10px'
      },
      '& $editIco': {
				display: 'inline-block'
			},
    }
  },
  setProfilePage: {
    container: {
			backgroundColor: theme.palette.emptyContentColor,
			overflowY: 'scroll'
		},
		notSelected: {
			width: '50%',
			height: '100%',
			fontSize: '25px',
			borderRadius: '10px',
			color: theme.palette.titleGreyColor
		},
		isSelected: {
			height: '100%',
			width: '50%',
			fontSize: '25px',
			backgroundColor: theme.palette.secondaryColor,
			borderRadius: '10px 10px 0px 0px',
			fontWeight: '300',
			color: '#ffffff'
		},
		loginBoxNavbar: {
			height: '60px',
			cursor: 'pointer'
		},
		picture: {
			backgroundColor: 'white',
			zIndex: 1,
			height: '600px',
			width: '700px',
			position: 'relative'
		},
		inputLabel: {
			width: '65%',
			fontSize: '18px',
			color: theme.palette.textGreyColor
    },

    
  }
  
})