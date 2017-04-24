import GameWorld from './gameWorld';
import {Common} from 'matter-js';
import {on} from './util';
import {GAME_EVENTS} from './events';
import React from 'react';
import {render} from 'react-dom';

const positionMap = {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: '4th',
    5: '5th'
};

class RetryScreen extends React.Component {
    render() {
        const {show, bg, position} = this.props;
        // Custom styles: set visibility and backbround color
        const styles = {
            modal: {
                display: (show)
                    ? null
                    : 'none',
                backgroundColor: bg || 'rgba(255, 255, 255, 0.8)'
            },
            retryButton: {
                fontSize: '4em'
            }
        };

        return (
            <div className="modal-wrapper" style={styles.modal} onClick={this.props.onClose}>
                <div className="modal-item">
                    <h1>You came {positionMap[position]}!</h1>
                </div>
            </div>
        );
    }
}

class SplashScreen extends React.Component {
    render() {
        const {show, onClose} = this.props;
        // Custom styles: set visibility and backbround color
        const styles = {
            modal: {
                display: (show)
                    ? null
                    : 'none',
                background: 'url(img/lowres/title.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            },
            modalBackground: {
                backgroundColor: 'white'
            },
            modalForeground: {
                background: 'url(img/title.png)'
            },
            retryButton: {
                fontSize: '4em'
            }
        };

        return (
            <div>
                <div className="modal-wrapper" style={Object.assign({}, styles.modal, styles.modalBackground)}></div>
                <div className="modal-wrapper" style={styles.modal} onClick={onClose}></div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        Common._seed = Date.now();

        this.state = {
            modalOpen: false,
            splashOpen: true,
            position: -1
        };

        on(GAME_EVENTS.GAME_OVER, (data) => {
            this.toggleModal(data.position);
        });
    }

    componentDidMount() {
        this.gameWorld = new GameWorld();
    }

    toggleModal(position) {
        let {modalOpen, splashOpen} = this.state;
        this.setState({
            modalOpen: !modalOpen,
            position: position,
            splashOpen: splashOpen
        });
    }

    retry() {
        this.toggleModal(0);
        this.gameWorld.resetWorld();
    }

    startGame() {
        this.setState({modalOpen: false, position: -1, splashOpen: false});
    }

    render() {
        const {modalOpen, position, splashOpen} = this.state;
        return (
            <div>
                <div id="game"></div>
                <SplashScreen show={splashOpen} onClose={this.startGame.bind(this)}/>
                <RetryScreen bg="rgba(130, 212, 168, 0.85)" show={modalOpen} position={position} onClick={this.retry.bind(this)} onClose={this.retry.bind(this)}/>
            </div>
        );
    }
}

render(
    <App/>, document.getElementById('reactroot'));
