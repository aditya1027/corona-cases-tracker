import React from 'react';
import Axios from "axios";
import './style.css';

export default class App extends React.Component {
    constructor(props) {
        super();
        this.getCountryData = this.getCountryData.bind(this);
    }
    state = {
        confirmed: 0,
        recovered: 0,
        deaths: 0,
        countries: []
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const resApi = await Axios.get("https://covid19.mathdro.id/api");
        const resCountries = await Axios.get("https://covid19.mathdro.id/api/countries");

        const countries = resCountries.data.countries.map(country => {
            return country.name;
        })

        //const countries = Object.keys(resCountries.data.countries);



        this.setState({
            confirmed: resApi.data.confirmed.value,
            recovered: resApi.data.recovered.value,
            deaths: resApi.data.deaths.value,
            countries
        });

    }

    async getCountryData(e) {
        if (e.target.value === "WorldWide") {
            return this.getData();
        }
        try {
            //console.log(e.target.value);
            const res = await Axios.get(`https://covid19.mathdro.id/api/countries/${e.target.value}`);
            this.setState({
                confirmed: res.data.confirmed.value,
                recovered: res.data.recovered.value,
                deaths: res.data.deaths.value,

            })
        }
        catch (err) {
            if (err.response.status === 404)
                this.setState({
                    confirmed: "No information available",
                    recovered: "No information available",
                    deaths: "No information available"
                })

        }
    }


    renderCountryOptions() {
        return this.state.countries.map((country, i) => {
            return <option key={i}>{country}</option>
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Corona Update</h1>


                <select className="dropdown" onChange={this.getCountryData}>
                    <option>WorldWide</option>                    {this.renderCountryOptions()}
                </select>

                <div className="flex">
                    <div className="box confirmed">
                        <h3>Confirmed Cases</h3>
                        <h4>{this.state.confirmed}</h4>
                    </div>


                    <div className="box recovered">
                        <h3>Recovered</h3>
                        <h4>{this.state.recovered}</h4>
                    </div>


                    <div className="box deaths">
                        <h3>Deaths</h3>
                        <h4>{this.state.deaths}</h4>
                    </div>

                </div>

            </div>);
    }
}

