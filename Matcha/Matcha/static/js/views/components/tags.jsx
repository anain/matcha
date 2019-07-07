import React from 'react'
import Wrapper from '../Wrapper';
import AddCircle from '@material-ui/icons/AddCircle'
import Edit from '@material-ui/icons/Edit'
import MultiSelect from "@kenshooui/react-multi-select"
import "@kenshooui/react-multi-select/dist/style.css"
import { style } from '../../styles/styles.jsx'
import Button from '../components/button'
const styles = (theme) => {
	return {
		...style.profilPage,
		tagEdit: {
			...style.profilPage.tag,
			border: `1px solid lightgrey`,
		},
		tagLabelEdit: {
			...style.profilPage.tagLabel,
			color: 'lightgrey'
		},
		editHover: {
			cursor: 'pointer',
			'&:hover': {
				color: theme.palette.textGreyColor,
				'& $tagEdit': {
					border: `1px solid grey`
				},
				'& $tagLabelEdit': {
					color: 'grey'
				}
			}
		},
	}
}

const messages = {
	searchPlaceholder: "Tags recherchés...",
	noItemsMessage: "Aucun tag ne correspond à votre recherche.",
	noneSelectedMessage:  "Aucun tag sélectionné.",
	selectedMessage: "Sélection",
	selectAllMessage: 'Sélectionner la liste',
	clearAllMessage: "Effacer la sélection",
	disabledItemsTooltip: "You can only select 1 file"
}

class Tags extends React.Component {
	constructor(props){
		super(props)
    this.tagSelect = this.tagSelect.bind(this)
		this.state={
			tagsEdit: false,
			editOpen: false,
			tagsList: [],
			tags: this.props.profile.tags
		}
	}

	componentDidMount() {
   this.props.getTags()
  } 

tagSelect(tags) {
    if (tags)
    {
      this.setState({tags : tags})
    }
  }

	render () {
		const { classes, profile, tagsList, editTags, mobile } = this.props
		const { tags, editOpen } = this.state
		const noTag = !profile.tags_list || !profile.tags_list.length
		return (
			<div className={`flex center alignCenter fullWidth`}>
					<div
						className={`flex row fullWidth ${classes.tagsContainer}`}
						style={mobile ? {justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap'} : {marginTop: '20px', flexWrap: 'wrap'}}
						>
						{
							profile.self
								? editOpen
									?	tagsList
										? <div className={`fullWidth flex column`} style={{height: '400px', marginBottom: '20px'}}>
												<MultiSelect
													height={300}
													items={tagsList}
													selectedItems={tags}
													messages={messages}
													maxSelectedItems = '5'
													onChange={(tags) => this.tagSelect(tags)}
													responsiveHeight={'100%'}
													showSelectedItems={!mobile}
												/>
												<Button
													title='Valider'
													empty
													onClick={()=>{
														editTags(tags)
														this.setState({editOpen: false})
													}}
													style={{width:'50%', alignSelf: 'center', marginTop: '10px'}}
												/>
											</div>
										: null
									: <div
											onClick={()=>{this.setState((previous)=>({editOpen: !previous.editOpen}))}}
											className={`fullWidth flex center alignCenter ${classes.noTagsBox} ${classes.editHover}`}
										>
											{noTag
											? <div className={`flex column alignCenter center`}>
													<AddCircle style={{width: '50px', height: '40px'}}/>
													Vous n'avez pas encore ajouté vos tags, cliquez ici pour les ajouter
												</div>
											: <div
													className={`flex alignCenter center
														${mobile ? 'grid-12-noGutter-noBottom' : null}
													`}
													style={mobile ? {width: '100%'} : null}
												>
														{profile.tags_list.map((tag, index) => {
															return <div
																key={index}
																className={`
																	${mobile ? 'col-2_sm-4' : null}
																	flex center alignCenter ${classes.tagEdit}
																`}
															>
																<div
																	className={classes.tagLabelEdit}
																	style={mobile ? {width: '100%', overflow:'hidden'} : null}
																>
																	{tag}
																</div>
															</div>})
														}
													<Edit style={{width: '50px', height: '40px'}}/>
												</div>
											}
										</div>
								: noTag
									? <div
										className={`fullWidth flex column center alignCenter ${classes.noTagsBox}`}
										style={mobile ? {height: '100px'} : null}
									>
										{profile.username} n'a pas encore renseigné ses intérêts.
									</div>
									: profile.tags_list.map((tag, index) => {
										return <div
												key={index}
												className={`flex center alignCenter ${classes.tag}`}
											>
												<div className={classes.tagLabel}>
													{tag}
												</div>
											</div>
									})
						}
					</div>
				</div>
		)
	}
}

export default Wrapper(styles)(
	(state)=>({
		profile: state.users,
		tagsList: state.home.tags
	}),
	{
    getTags: () => ({type: 'GET_TAGS'}),
    editTags: (data) => ({type: 'EDIT_TAGS', payload: data}),
	}
)(Tags)