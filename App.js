import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  StatusBar,
  Platform,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native';
import {
  Header,
  SearchBar,
  Icon
} from 'react-native-elements';
import Modal from "react-native-modal";
import AwesomeAlert from 'react-native-awesome-alerts';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const BASE_PADDING = 10;

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
      todoDataSource: ds,
      currentURL: '',
      modalUp: false,
      showAlert: false,
    }
  }

  componentWillUnmount = () => {
    console.log('unmounting')
    this._toggleModal();
  }


  componentDidMount = () => {
  }


  pressRow = (url) => {
    this._toggleModal();
    this.setState({
      currentURL: url,
    });
    console.log('URL: ' + url);
  }

  async
  renderRow = (task, sectionID, rowID, highlightRow) => {
    return (
      <TouchableNativeFeedback onPress={() => {
        this.pressRow(task);
        highlightRow(sectionID, rowID);
      }}>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={{ uri: task }}
          />
        </View>
      </TouchableNativeFeedback>

    )
  }

  async
  fetchTodos = (searchItem) => {
    this.setState({
      listOfImages: []
    })
    const webSearch = encodeURIComponent(searchItem);
    console.log(webSearch);
    const fetchURL = `https://pixabay.com/api/?key=10372042-64b612b13ea81569c2b741292&per_page=20&page&image_type=photo&pretty=true&q=${webSearch}`;
    console.log(fetchURL);
    fetch(fetchURL)
      .then((response) => response.json())
      .then((response) => {
        let placeholderArray = [];
        for (var i = 0; i < response.hits.length; i++) {
          placeholderArray.push(response.hits[i].largeImageURL);
        }

        this.setState({
          todoDataSource: this.state.todoDataSource.cloneWithRows(placeholderArray)
        })
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
      duration: 250,
      easing: Easing.ease,
    }).start();
  }

  _handleOnChangeText = (text) => {
    this.setState({ textValue: text });

  }

  _onSubmitHandler = (event) => {
    console.log(this.state.textValue);
    this._lowerSearchBar();
    this.fetchTodos(this.state.textValue);
  }

  _toggleModal = () => {
    this.setState({ modalUp: !this.state.modalUp, })
  }

  toggleAlert = () => {
    this.setState({ showAlert: !this.state.showAlert, })
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

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Information"
          message="This app was created by Lance Magnaye"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Ok"
          confirmButtonColor="rgb(61, 109, 204)"
          onCancelPressed={() => {
            this.toggleAlert();
          }}
          onConfirmPressed={() => {
            this.toggleAlert();
          }}
        />

        {this.state.modalUp && <Modal transparent={true} isVisible={true}>
          <View style={{ width: WINDOW_WIDTH }}>
            <StatusBar hidden={true} />
            <Icon
              name='clear'
              color='red'
              onPress={this._toggleModal}
              containerStyle={{ width: 20, height: 20 }}
            />
            <Image
              style={{ width: "100%", height: 300, resizeMode: 'center' }}
              source={{ uri: this.state.currentURL }}
            />

          </View>
        </Modal>}

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
            onSubmitEditing={(event) => this._onSubmitHandler(event)}
            cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
          />
        </Animated.View>

        <Header
          placement="center"
          leftComponent={{ icon: 'info-outline', color: '#fff', onPress: this.toggleAlert }}
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
          enableEmptySections={true}
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
    borderColor: 'rgb(44, 86, 168)',
    borderWidth: 5,
    marginTop: 20,
    borderRadius: 20

  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  listView: {
    flex: 1,
    width: "100%",
    zIndex: -1
  },

  modalView: {
    backgroundColor: "#aaa",
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
