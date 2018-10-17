import React from 'react';
import { StyleSheet, Text, View, Animated, Easing, StatusBar, Platform, ListView, TouchableHighlight, Image } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';

export default class App extends React.Component {
  constructor() {
    super();
    this.searchTop = new Animated.Value(0);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      searchBarLower: true,
      rightIcon: true,
      todoDataSource: ds
    }
  }

  componentDidMount = () => {
    console.log();
  }

  pressRow = (rowID) => {
    console.log('Row number ' + rowID);
  }

  async
  renderRow = (task, sectionID, rowID, highlightRow) => {
    return (
      <TouchableHighlight onPress={() => {
        this.pressRow(rowID);
        highlightRow(sectionID, rowID);
      }}>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={{ uri: task.largeImageURL }}
          />
        </View>
      </TouchableHighlight>

    )
  }

  async
  fetchTodos = (searchItem) => {
    const webSearch = encodeURIComponent(searchItem);
    console.log(webSearch);
    const fetchURL = `https://pixabay.com/api/?key=10372042-64b612b13ea81569c2b741292&per_page=10&page&image_type=photo&pretty=true&q=${webSearch}`;
    console.log(fetchURL);
    fetch(fetchURL)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response.hits)
        this.setState({
          todoDataSource: this.state.todoDataSource.cloneWithRows(response.hits)
        });
      })
  }

  _lowerSearchBar() {
    const opposite = !this.state.searchBarLower;
    const otherIcon = !this.state.rightIcon;
    this.setState({
      searchBarLower: opposite,
      rightIcon: otherIcon,
      searchTerm: '',
    });


    const theValue = this.state.searchBarLower ? 1 : 0;
    Animated.timing(this.searchTop, {
      toValue: theValue,
      duration: 500,
      easing: Easing.ease,
    }).start();
  }

  _handleOnChangeText = (text) => {
    this.fetchTodos(text);

  }


  render() {
    const icon = this.state.rightIcon ? 'search' : 'arrow-upward';

    const moveSearchInterpolate = this.searchTop.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 70]
    })

    const bgMoveStyle = {
      top: moveSearchInterpolate
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />

          <Animated.View style={bgMoveStyle}>
            <SearchBar
              noIcon
              platform={Platform.OS}
              placeholder='Search'
              containerStyle={[styles.searchContainer]}
              inputStyle={{
                backgroundColor: 'rgb(44, 86, 168)',
                color: '#fff'

              }}
              clearIcon={{ name: 'clear', color: 'red' }}
              onChangeText={(text) => this._handleOnChangeText(text)}
              cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
            />
          </Animated.View>

          <Header
            placement="center"
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'Gallery'.toUpperCase(), style: { color: '#fff' } }}
            rightComponent={{ icon: icon, color: '#fff', onPress: this._lowerSearchBar.bind(this) }}
            containerStyle={{
              backgroundColor: 'rgb(61, 109, 204)',
              color: 'rgb(61, 109, 204)',
              justifyContent: 'space-around',
            }}
            outerContainerStyles={{ borderBottomWidth: 0, }}
            backgroundColor='rgb(61, 109, 204)'
          />

        <ListView
          style={styles.listView}
          dataSource={this.state.todoDataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'column',
  },

  searchContainer: {
    backgroundColor: 'rgb(61, 109, 204)',
    justifyContent: 'space-around',
    width: "100%",
    alignSelf: 'center',
    position: 'absolute',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  listView: {
    flex: 1,
    width: "100%",
    zIndex: -1

  }
});
