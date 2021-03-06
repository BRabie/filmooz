// EXT
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Share, Platform, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';

// INT
import styles from'./FilmDetailsStyle'
import Locals from './FilmDetailsLocals'
import FavContext from '../../Context/FavContext'
import FavIcon from '../Favorite/FavIcon'
import { getFilmDetailsFromApi, getImage } from'../../API/TMDBapi'

export default function FilmDetails(props) {

	// CONTEXT
	const context = useContext(FavContext)

	// CONSTANTS
	const navigation = props.navigation
	const film = props.route.params.film

	// STATES
	const [isLoading, setisLoading] = useState(true)
	const [filmDetails, setFilmDetails] = useState(null)

	// FUNCTIONS
	function getNamesFromArray (target) {

		let dataArray = filmDetails[target];
		let values = ""
		for (let i = 0; i < dataArray.length; i++) {
		  if ( i != dataArray.length - 1) {
		  	values += dataArray[i].name + ", "
		  } else {
		  	values += dataArray[i].name
		  }
		}
		return values
	}

	function shareFilm(){
		Share.share({title: film.title, message: film.overview})
	}

	// LOGIC
  function displayFavIcon(){
    let sourceImage
    if (context.favoritesFilm.findIndex(item => item.id === film.id) !== -1){
      sourceImage = require('../../assets/Icons/ic_favorite.png')
    } else {
			sourceImage = require('../../assets/Icons/ic_favorite_border.png')
		}
    return(
      <Image
        source={sourceImage}
        style={styles.favIcon}
      />
    )
  }

	const navigationOptions = film != undefined && Platform.OS === 'ios' && {
		headerRight: () => { return (
					<TouchableOpacity
						style={{ padding: 10, marginRight: 10}}
						onPress={() => shareFilm()}>
						<Image
							style={{ height: 30, width: 30}}
							source={require('../../assets/Icons/share_ios.png')} />
					</TouchableOpacity>
			)}
	}

	useEffect(() => {
    navigation.setOptions(navigationOptions)
		getFilmDetailsFromApi(film.id).then(data => {
			setFilmDetails(data)
			setisLoading(false)
		})
	}, []);

	return (
		<View style={styles.container}>
			{ isLoading &&
				<View style={styles.loading_container}>
					<ActivityIndicator size="large" color="#d01616" />
				</View>
			}
			{
				filmDetails ?
					<ScrollView Style={styles.SV_Container}>

						<Image
							style={styles.imageFilm}
							source={{uri: getImage(filmDetails.poster_path)}}
						/>

						<Text style={styles.Title}> {filmDetails.title} </Text>

					  <FavIcon film={filmDetails}/>

						{ filmDetails.overview ? <Text style={styles.descriptionFilm}> {filmDetails.overview} </Text> : <></>}


						<View style={styles.Details}>
							<Text style={styles.DetailsText}> { Locals.Average_Votes } :  {filmDetails.vote_average} / 10 </Text>
							<Text style={styles.DetailsText}> { Locals.Number_of_votes } :  {filmDetails.popularity} </Text>
							<Text style={styles.DetailsText}> { Locals.Release_date } :  {filmDetails.release_date} </Text>
							<Text style={styles.DetailsText}> { Locals.Type } :  {getNamesFromArray('genres')} </Text>
							{ getNamesFromArray('production_companies') ? <Text style={styles.DetailsText}> { Locals.Company } :  {getNamesFromArray('production_companies')} </Text> : <></>}
						</View>

					</ScrollView>

				:

					<ScrollView Style={styles.SV_Container}>

						<Image
							style={styles.imageFilm}
							source={{uri: getImage(film.poster_path)}}
						/>

						<Text style={styles.Title}> {film.title} </Text>

						<Text style={styles.descriptionFilm}> {film.overview} </Text>

						<View style={styles.Details}>
							<Text style={styles.DetailsText}> { Locals.Average_Votes } :  {film.vote_average} / 10 </Text>
							<Text style={styles.DetailsText}> { Locals.Number_of_votes } :  {film.popularity} </Text>
							<Text style={styles.DetailsText}> { Locals.Release_date } :  {film.release_date} </Text>
						</View>

					</ScrollView>
			}
      { film != undefined && Platform.OS === 'android' &&
				<TouchableOpacity
					style={styles.shareButton}
					onPress={() => shareFilm()}>
						<Image style={{height: 35, width: 35}} source={require('../../assets/Icons/share.png')}/>
				</TouchableOpacity>
		  }
		</View>
	)
}
