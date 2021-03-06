import React, { Component } from 'react'
import { Howl } from 'howler'
import InstrumentCard from './InstrumentCard'

class InstrumentTable extends Component {
    constructor(props) {
        super(props);
        this.howlers = this.createHowlers(this.props.data);
        for(let instrument in this.howlers) {
            console.log(this.howlers[instrument].state());
        }
        this.state = {
            selectedTracks: {}
        }
    }

    stopSelectedTracks = () => {
        for(let instrument in this.state.selectedTracks) {
            if(this.howlers[instrument].playing()) {
                this.howlers[instrument].stop();
            }
        }
    };

    updateSelectedTracks = (instrument, track) => {
        let selectedTracks = Object.assign({}, this.state.selectedTracks);

        if(selectedTracks[instrument] === track) {
            delete selectedTracks[instrument];
        }
        else {
            selectedTracks[instrument] = track;
        }
        this.setState({selectedTracks}, this.playSelectedTracks);
    };

    playSelectedTracks = () => {
        for(let t in this.state.selectedTracks) {
            let track = this.state.selectedTracks[t].title;
            this.howlers[t].play(track);
        }
    };

    selectTrack = async (instrument, track) => {
        this.stopSelectedTracks();
        await this.sleep(300);
        this.updateSelectedTracks(instrument, track);
    };

    sleep = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    };

    createInstrumentCards = () => {
        let data = this.props.data;
        let instruments = [];
        for(let instrument in data) {
            let selectedTrack = this.state.selectedTracks[instrument];
            let tracks = data[instrument].tracks;
            let icon = data[instrument].icon;
            instruments.push(
                <td>
                    <InstrumentCard
                        name={instrument}
                        tracks={tracks}
                        icon={icon}
                        selectedTrack={selectedTrack}
                        selectTrack={this.selectTrack} />
                </td>);
        }
        return instruments;
    };

    createHowlers = (data) => {
        let instruments = {};
        for(let instrument in data) {
            instruments[instrument] = new Howl({
                src: [data[instrument].src],
                sprite: this.createSprites(data[instrument].tracks)
            });
        }
        return instruments;
    };

    createSprites = (tracks) => {
        let sprites = {};
        for(let track in tracks) {
            sprites[tracks[track].title] = [tracks[track].start, tracks[track].duration, true];
        }
        return sprites;
    };

    render() {
        return (
            <table className='table'>
                {this.createInstrumentCards()}
            </table>
        )
    }
}

export default InstrumentTable;