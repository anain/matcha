import React from 'react'
import Wrapper from '../../Wrapper'
import { style } from '../../../styles/styles.jsx'
import { historyPush } from '../../../config/history'
import SearchingBox from './SearchingBox'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import BounceLoader from 'react-spinners/BounceLoader'
import Divider from '@material-ui/core/Divider'
import SimpleSelect from './Order'
import "@kenshooui/react-multi-select/dist/style.css"
import Clear from '@material-ui/icons/Clear'

const styles = (theme) => {
	return {
		...style.matchPage,
		mobileCardPicture: {
			padding: '5px 0px',
      		height: '120px',
			width: '120px',
			borderRadius: '10px'
		},
		username: {
			fontWeight: 'bold',
		},
		ageLabel: {
			color: theme.palette.titleGreyColor,
		},
		distLabel: {
			paddingLeft: '5px',
			color: theme.palette.textGreyColor,
		},
		descLabel: {
			color: theme.palette.blackColor,
			maxWidth: '80%',
			alignSelf: 'end',
			overflowWrap: 'break-word'
		},
		leftContainer: {
			height: 'fit-content',
			backgroundColor: '#ffffff',
			marginRight: '15px',
			marginTop: '20px',
			maxWidth: '800px',
		}
	}
}


const HomeDesktop = ({city, matchRequesting, expanded, advancedSearch,
	 searchResults, sliderValueChange, checkBoxChange, tagSelect ,
		tags, tagsList, classes, age, popularity, distance, gender,
		 setValue, matches, mobile, matchOnly, applySearchSort, currentOrder, currentMatchOrder, applyMatchSort, moreSearch, resetSearch, removeFromSuggestions}) => {
	return (
		<div
			className={`fullHeight fullWidth grid-12-noBottom-noGutter flex row center`}
		>
			<div
				className={`col-${mobile ? `8_md-12` : `5`} ${classes.leftContainer}`}
				style={mobile ? {maxWidth: '720px', margin: 0, marginTop: '20px'} : {maxWidth: '700px'}}
			>
				<div className={`flex alignCenter center ${classes.titleSection}`}>
					Matcha aimerait vous présenter...
				</div>
				<div className={`relative fullWidth flex center alignCenter`} style={{top: '20px'}}>
					<BounceLoader
						sizeUnit={'px'}
						size={40}
						color={'#ff6c6c'}
						loading={matchRequesting && !matches.length}
					/>
				</div>
				{!matches.length && <div className={`fullWidth fullHeight flex center alignCenter`} style={{height: '200px', borderRadius: '20px', color: 'grey', fontSize: '20px'}}>
						<div style={{width: '80%'}}>Renseignez votre profil avec soin et Matcha trouvera les profils qui vous correspondent</div>
					</div>}
				<div className={classes.searchResultContainer} style={{minHeight: '200px'}}>
				{matches.length > 0  && <div className={`flex column alignCenter center`}>
					 <SimpleSelect              
						  sort={applyMatchSort}
						  currentOrder={currentMatchOrder}
			  		/>
						<Divider style={{color: 'black', width: '100%', marginTop: '5px'}}/>
					</div>}
					{
						matches && matches.map((matchProfile, index) => {
							const picture = matchProfile.img
							? `data:image/jpeg;base64,${matchProfile.img}`
							: 'https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg'
						
							return <div
								key={index}
								className={`grid-12-noBottom-noGutter fullWidth flex row alignCenter ${classes.profileCard}`}
								style={{marginTop: '5px'}}
							>
								<div className={`col-11 grid-12-noBottom-noGutter fullWidth flex row alignCenter`} onClick={() => { historyPush(`/profile/${matchProfile.username}`) }}>
									<div className={`col-4 flex center alignCenter`}>
										<img src={picture} alt={matchProfile.username} className={classes.mobileCardPicture} />
									</div>
									<div className={`col-8 flex column center alignCenter center`}>
										<div className={`fullWidth flex row alignCenter`}>
											<span className={classes.username}>
												{matchProfile.username.charAt(0).toUpperCase() + matchProfile.username.slice(1)}
											</span>
											<span className={classes.distLabel}>
												{matchProfile.distance}
											</span>
										</div>
										<span className={classes.descLabel}>
											{matchProfile.short_desc}
										</span>
									</div>
								</div>
								<div className={`col-1 flex center`}>
									<div className={`flex center alignCenter`} style={{width: '30px', height: '30px'}}  onClick={()=>{removeFromSuggestions(matchProfile.id)}}>
										<Clear style={{width: '25px', height: '25px', color: 'grey'}}/>
									</div>
								</div>
									<Divider style={{color: 'black', width: '100%', marginTop: '5px'}}/>
							</div>
						})
					}
				</div>
			</div>
			<div className={`col-6_md-12`} style={{maxWidth: '720px', marginTop: '20px'}}>
				<div className={`flex alignCenter center ${classes.titleSection}`}>
					Recherche
				</div>
				<SearchingBox
					checkBoxChange={checkBoxChange}
					sliderValueChange={sliderValueChange}
					tagSelect={tagSelect}
					age={age}
					popularity={popularity}
					distance={distance}
					gender={gender}
					tags={tags}
					setValue={setValue}
					tagsList={tagsList}
					expanded={expanded}
					advancedSearch={advancedSearch}
					city={city}
					resetSearch={resetSearch}
					matchOnly={matchOnly}
				/>
				<div className={classes.searchResultContainer} style={{marginTop: '10px'}}>
					{!searchResults.length && <div className={`fullWidth fullHeight flex center alignCenter`} style={{height: '200px', borderRadius: '20px', color: 'grey', fontSize: '20px'}}>
						Aucun résultat
					</div>}
					{searchResults.length > 0  && <div className={`flex column alignCenter center`}>
					 <SimpleSelect              
						  sort={applySearchSort}
						  currentOrder={currentOrder}
			  		/>
						<Divider style={{color: 'black', width: '100%', marginTop: '5px'}}/>
					</div>}
					{
						searchResults && searchResults.map((res, index) => {
							const picture = res.img
							? `data:image/jpeg;base64,${res.img}`
							: 'https://www.cardiff.ac.uk/__data/assets/image/0014/10841/no-profile.jpg'
						
							return <div
							key={index}
							className={`grid-12-noBottom-noGutter fullWidth flex row alignCenter ${classes.profileCard}`}
							style={{marginTop: '5px'}}
						>
							<div className={`col-11 grid-12-noBottom-noGutter fullWidth flex row alignCenter`} onClick={() => { historyPush(`/profile/${res.username}`) }}>
								<div className={`col-4 flex center alignCenter`}>
									<img src={picture} alt={res.username} className={classes.mobileCardPicture} />
								</div>
								<div className={`col-8 flex column center alignCenter`}>
									<div className={`fullWidth flex row alignCenter`}>
										<span className={classes.username}>
											{res.username.charAt(0).toUpperCase() + res.username.slice(1)}
										</span>
										<span className={classes.distLabel}>
											{res.distance}
										</span>
									</div>
									<span className={classes.descLabel}>
										{res.short_desc}
									</span>
								</div>
							</div>
							</div>
						})
					}
				</div>
				<div className={`fullWidth flex center alignCenter`} onClick={moreSearch} style={{backgroundColor: 'white', color: 'grey', cursor: 'pointer'}}>
					Voir plus <KeyboardArrowDown style={{color: 'grey', width: '30px', height: '30px'}}/>
				</div>
			</div>
		</div>
	)
}
export default Wrapper(styles)()(HomeDesktop)