import React, { Component } from 'react'
import Wrapper from '../Wrapper'
import { style } from '../../styles/styles.jsx'
import HomeDesktop from './components/HomeDesktop'
import HomeMobile from './components/HomeMobile'

const styles = (theme) => {
  return {
	...style.matchPage
  }
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.sliderValueChange = this.sliderValueChange.bind(this)
    this.checkBoxChange = this.checkBoxChange.bind(this)
    this.tagSelect = this.tagSelect.bind(this)
    this.setValue = this.setValue.bind(this)
    this.advancedSearch = this.advancedSearch.bind(this)
    this.matchRequest = this.matchRequest.bind(this)
    this.applySearchSort = this.applySearchSort.bind(this)
    this.applyMatchSort = this.applyMatchSort.bind(this)
    this.moreSearch = this.moreSearch.bind(this)
    this.resetSearch = this.resetSearch.bind(this)
    this.removeFromSuggestions = this.removeFromSuggestions.bind(this)
    this.state = {
      city: '',
      age: {
        min: 18,
        max: 100
      },
      location: '',
      distance: 1000,
      tags: [],
      popularity: {
        min: 0,
        max: 1000
      },
      gender: {
        M: true,
        F: true,
        genderCode: 'MF'
      },
      currentOrder: this.props.currentOrder,
      currentMatchOrder: this.props.currentMatchOrder,
      matchMore: 0,
      searchMore: 0,
      matchOnly: false,
      width: 0,
      height: 0,
      value: 0,
      matches: [],
      searchResults: [],
      tagsList: [],
      expanded: false,
      desc: '',
    }
  }
  sliderValueChange(key, value) {
    this.setState({
      [key]: {
        min: value[0],
        max: value[1]
      }
    })
  }

  removeFromSuggestions(matchProfileId) {
    this.props.NoGo(matchProfileId)
    this.matchRequest() 
  }

  moreSearch() {
    this.setState({searchMore: this.state.searchMore + 1}, () => this.advancedSearch(false))
  }

  resetSearch() {
    this.setState({moreSearch: 0}, () => this.advancedSearch(true))
  }


  tagSelect(tags) {
    if (tags)
    {
      this.setState({tags : tags})
    }
  }

  checkBoxChange(event) {
    if (event.target.value == 'match') {
      this.setState({matchOnly : !this.state.matchOnly})
    }
    else {
      const newGender = this.state.gender
      newGender[event.target.value] = !this.state.gender[event.target.value]
      newGender.genderCode = 'MF'
      if (newGender.F == true && newGender.M == false) newGender.genderCode = 'F'
      if (newGender.M == true && newGender.F == false) newGender.genderCode = 'M'
      this.setState({gender : newGender})
    }
  }

  applySearchSort(event) {
    this.setState({currentOrder: event.target.value, searchMore: 0}, () => this.resetSearch())
  }

  applyMatchSort(event) {
    this.setState({currentMatchOrder: event.target.value}, () => this.props.orderMatches(this.state.currentMatchOrder))
  }

  setValue(key, value) {
    this.setState({[key]: value})
  }

  updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  
  componentDidUpdate(oldProps) {
    const newProps = this.props;
		if (oldProps.matches !== newProps.matches) {
			this.setState({
				matches: newProps.matches
			})
    }
    if (oldProps.currentOrder !== newProps.currentOrder) {
			this.setState({
				currentOrder: newProps.currentOrder
			})
    }
    if (oldProps.currentMatchOrder !== newProps.currentMatchOrder) {
			this.setState({
				currentMatchOrder: newProps.currentMatchOrder
			})
    }
    if (oldProps.searchCrit !== newProps.searchCrit && newProps.searchCrit.age) {
			this.setState({
        age: newProps.searchCrit.age,
        tags: newProps.searchCrit.selectedTagsList,
        popularity: newProps.searchCrit.popularity,
        gender: newProps.searchCrit.gender,
        desc: newProps.searchCrit.desc,
        city: newProps.searchCrit.geoloc && newProps.searchCrit.geoloc.city ? newProps.searchCrit.geoloc.city : null,
        distance: newProps.searchCrit.geoloc && newProps.searchCrit.geoloc.distance ? newProps.searchCrit.geoloc.distance : null,
			})
    }
   if (oldProps.searchResults !== newProps.searchResults) {
			this.setState({
				searchResults: newProps.searchResults
			})
    }
    if (oldProps.tags !== newProps.tags && newProps.tags !== null && this.state.tagsList.length === 0) {
      this.setState({
      tagsList: newProps.tags,
     })
    }
   }


  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.matchRequest() 
    this.props.getTags()
    if (this.props.tags){
      this.setState({
      tagsList: this.props.tags,
    })
    }
   if (this.props.searchResults.length > 0){
    this.setState({
      searchResults: this.props.searchResults,
     })
   }
   else
    this.props.getLastsearch()  
  }
  
  matchRequest() {
    const data = {
      order: this.state.currentMatchOrder,
      matchMore: this.state.matchMore
      }
      this.props.getMatches(data)
      if (this.props.matches){
        this.setState({
         matches: this.props.matches
       })
     }
    }

  advancedSearch (newSearch) {
    const selectedTagsList = []
    const { age, popularity, currentOrder, city, distance, tags, gender, searchMore, matchOnly } = this.state
    const tagsIdList= []
    for (var i = 0; i < this.state.tags.length; i++) { 
      selectedTagsList.push(this.state.tags[i])
      tagsIdList.push(this.state.tags[i]['id'])
      }
      const data = {
      newSearch: newSearch,
      currentOrder: currentOrder,
      age: {
        min: age.min,
        max: age.max
      },
      geoloc: {
        city: city,
        distance: distance
      },
      tagsStorage: tags,
      tags: tagsIdList,
      selectedTagsList : selectedTagsList,
      popularity: {
        min: popularity.min,
        max: popularity.max
      },
      gender: gender,
      currentOrder: currentOrder,
      moreSearch: newSearch == true ? 0 : searchMore
    } 
    if (matchOnly == true)
      this.props.matchFilterApply(data)
    else
      this.props.search(data)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  render () {
    const { matchRequesting } = this.props
    const { age, location, distance, tags, popularity, gender, matches,
     searchResults, tagsList, city, currentOrder, currentMatchOrder, matchOnly, width } = this.state
    const mobileFormat = this.state.width <= 800

		return (
			<div className={`fullWidth fullHeight`} style={{overflowY: 'scroll'}}>
        {
          mobileFormat
            ? <HomeMobile
              advancedSearch={this.advancedSearch}
              sliderValueChange={this.sliderValueChange}
              checkBoxChange={this.checkBoxChange}
              tagSelect={this.tagSelect}
              age={age}
              location={location}
              distance={distance}
              tags={tags}
              popularity={popularity}
              gender={gender}
              setValue={this.setValue}
              matches={matches}
              matchRequesting={matchRequesting}
              tagsList={tagsList}
              searchResults={searchResults}
              city={city}
              applySearchSort={this.applySearchSort}
              applyMatchSort={this.applyMatchSort}
              currentOrder={currentOrder}
              currentMatchOrder={currentMatchOrder}
              moreSearch={this.moreSearch}
              resetSearch={this.resetSearch}
              matchOnly={matchOnly}
              removeFromSuggestions={this.removeFromSuggestions}
            />
            : <HomeDesktop
              searchResults={searchResults}
              sliderValueChange={this.sliderValueChange}
              checkBoxChange={this.checkBoxChange}
              tagSelect={this.tagSelect}
              age={age}
              location={location}
              distance={distance}
              tags={tags}
              popularity={popularity}
              gender={gender}
              setValue={this.setValue}
              matches={matches}
              matchRequesting={matchRequesting}
              advancedSearch={this.advancedSearch}
              tagsList={tagsList}
              city={city}
              mobile={width < 1290}
              applySearchSort={this.applySearchSort}
              applyMatchSort={this.applyMatchSort}
              currentOrder={currentOrder}
              currentMatchOrder={currentMatchOrder}
              moreSearch={this.moreSearch}
              resetSearch={this.resetSearch}
              matchOnly={matchOnly}
              removeFromSuggestions={this.removeFromSuggestions}
            />
        }
      </div>
    )
  }
}

//export default Wrapper(styles)()(Home)

export default Wrapper(styles)(
	state=>({
		state: state,
    matches: state.home.matches,
    matchRequesting: state.home.getMatchesRequesting,
    searchResults: state.home.searchResults,
    tags: state.home.tags,
    currentOrder: state.home.searchOrder,
    currentMatchOrder: state.home.currentMatchOrder,
    searchCrit: state.home.searchCrit
	}),
	{
    getMatches: (data) => ({type: 'GET_MATCHES', payload: data}),
    orderMatches: (data) => ({type: 'ORDER_MATCHES', payload: data}),
    search: (data) => ({type: 'GET_SEARCH', payload: data}),
    getTags: () => ({type: 'GET_TAGS'}),
    getLastsearch: () => ({type: 'GET_LAST_SEARCH'}),
    matchFilterApply: (data) => ({type: 'GET_MATCH_FILTER', payload: data}),
    NoGo: (data) => ({type: 'NO_GO', payload: data})
  }
  )(Home)