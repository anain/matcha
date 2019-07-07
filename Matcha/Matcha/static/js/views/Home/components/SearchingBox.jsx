import React from 'react'
import Wrapper from '../../Wrapper'
import { style } from '../../../styles/styles.jsx'
import Checkbox from '@material-ui/core/Checkbox'
import Slider from 'rc-slider'
import Tooltip from 'rc-tooltip'
import TextField from '@material-ui/core/TextField'
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import MultiSelect from "@kenshooui/react-multi-select"
import "@kenshooui/react-multi-select/dist/style.css"
import Button from '../../components/button'

const messages = {
    searchPlaceholder: "Tags recherchés...",
    noItemsMessage: "Aucun tag ne correspond à votre recherche.",
    noneSelectedMessage:  "Aucun tag sélectionné.",
		selectedMessage: "Sélection",
		selectAllMessage: 'Sélectionner la liste',
    clearAllMessage: "Effacer la sélection",
    disabledItemsTooltip: "You can only select 1 file"
  }

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle

const styles = (theme) => {
	return {
		...style.matchPage,
		toto: {
			margin: 0,
			paddingTop: 0,
			display: 'flex',
			flexDirection: 'column'
		},
	}
}

const handle = (props) => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<Tooltip
			prefixCls="rc-slider-tooltip"
			overlay={`${value} km`}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={value} {...restProps} />
		</Tooltip>
	)
}

const ageRange = (classes, age, sliderValueChange) => {
	return (
		<div className={`fullWidth flex row alignCenter center`}>
			<div className={`${classes.sectionLabel}`}>Tranche d'âge</div>
			<div className={classes.rangeLabel}>{age.min} ans</div>
			<Range
				min={18}
				max={100}
				defaultValue={[0, 100]}
				value={[age.min, age.max]}
				tipFormatter={value => `${value} ans`}
				style={{width: '100px'}}
				onChange={(event)=>{sliderValueChange('age', event)}}
			/>
			<div className={classes.rangeLabel}>{age.max} ans</div>
		</div>
	)
}

const nearInput = (classes, setValue, city) => {
	return (
		<div className={`fullWidth flex row`}>
			<div className={`${classes.sectionLabel}`}>Près de</div>
			<TextField
				placeholder='Votre ville'
				name='ville'
				value={city || ''}
				variant="outlined"
				style={{
					width: '250px'
				}}
				inputProps={{maxLength: 60}}
				onChange={(event) => { setValue('city', event.target.value) } }
			/>
		</div>
	)
}

const SearchingBox = ({ classes, sliderValueChange, mobile, city,
	 age, popularity, gender, distance, checkBoxChange, tags, tagsList,
	  tagSelect, setValue, resetSearch, matchOnly}) => {
		return (
			<div className={`fullWidth flex column alignCenter
				${classes.advancedSearchContainer}`}
			>
				<div className={`fullWidth`}>
					<ExpansionPanel expanded={true} classes={{expanded: classes.toto}}>
						<ExpansionPanelDetails classes={{root: classes.toto}}>
							<div className={`fullWidth flex column center alignCenter`}>
								<div className={`fullWidth flex column center alignCenter`}>
									<div className={`fullWidth flex column spaceAround`} style={{height: '300px'}}>
										<MultiSelect
											items={tagsList}
											selectedItems={tags}
											messages={messages}
											maxSelectedItems = '5'
											onChange={(tags) => tagSelect(tags)}
											responsiveHeight={'80%'}
											showSelectedItems={!mobile}
										/>
									</div>
									<div className={`fullWidth flex row alignCenter`}>
										<div className={`${classes.sectionLabel}`}>Genre</div>
										<Checkbox 
											value = 'F' 
											checked={gender ? gender.F : false}
											onChange={(event)=>{checkBoxChange(event)}} 
											color='primary'/>
										<div className={classes.rangeLabel} style={{padding: 0}}>F</div>
										<Checkbox 
											value = 'M' 
											checked={gender ? gender.M : false}
											onChange={(event)=>{checkBoxChange(event)}} 
											color='primary'
											/>
										<div className={classes.rangeLabel} style={{padding: 0}}>M</div>
											{!mobile && ageRange(classes, age, sliderValueChange)}
									</div>
											{mobile && ageRange(classes, age, sliderValueChange)}
											<div className={`fullWidth flex row alignCenter`}>
												<div className={`${classes.sectionLabel}`}>Popularité</div>
												<div
													className={classes.rangeLabel}
													style={mobile ? {padding: '10px'} : null}
												>
													{popularity.min}
												</div>
												<Range
													min={0}
													max={10}
													defaultValue={[0, 10]}
													value={[popularity.min, popularity.max]}
													tipFormatter={value => `${value}`}
													style={mobile ? {padding: '10px', width: '100px'} : {width: '100px'}}
													onChange={(event)=>{sliderValueChange('popularity', event)}}
												/>
												<div className={classes.rangeLabel}>{popularity.max}</div>
												{!mobile && nearInput(classes, setValue, city)}
											</div>
											{mobile && nearInput(classes, setValue, city)}
											<div className={`fullWidth flex center alignCenter`}>
												<div className={`${classes.sectionLabel}`}>Dans un rayon de</div>
												<Slider
													min={0}
													max={1000}
													defaultValue={1000}
													value={distance}
													handle={handle}
													style={{width: '100px'}}
													onChange={(event)=>{setValue('distance', event)}}
												/>
												<div className={classes.rangeLabel}>{`${distance}km`}</div>
												</div>
										<div className={`fullWidth flex row alignCenter`}>
										<div className={`${classes.sectionLabel}`}>Uniquement parmi les recommandations</div>
											<Checkbox 
												value = 'match' 
												checked={matchOnly}
												onChange={(event)=>{checkBoxChange(event)}} 
												color='primary'/>
										</div>

											
								</div>
							</div>
							<Button title='Rechercher' empty onClick={() => {resetSearch()
																			}} style={{width:'50%', alignSelf: 'center', marginTop: '10px'}}/>
							
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</div>
			</div>
		)
}

export default Wrapper(styles)()(SearchingBox)