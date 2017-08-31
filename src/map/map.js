import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';


class Map extends Component{
    
    constructor(props){
        super(props);
        
        this.animate.bind(this);
        d3.json('https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.json',(err,world)=>{
            
            let countries = topojson.feature(world,world.objects.countries);
            let projection = d3.geoOrthographic().fitSize([this.props.width,this.props.height],countries);
            
            this.setState({
                countries,
                land:topojson.feature(world,world.objects.land),
                projection:d3.geoOrthographic().fitSize([this.props.width,this.props.height],countries),
                path:d3.geoPath().projection(projection),
                graticule:d3.geoGraticule(projection)
            });        

            d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson',(err,quakes)=>{
               quakes = quakes.features.filter(quake => quake.properties.felt !== null && quake.properties.mag > 3);
               this.setState(Object.assign({},this.state,{quakes}));   
               this.animate();
            });
        });

        
    }

    render(){
        let self = this;
        if(!this.state || !this.state.countries || !this.state.quakes) return null;
         return(
            <svg width={this.props.width} height={this.props.height}>
                 {/* <path className="graticule" d={this.state.path(this.state.graticule.outline())}></path> */}
                 <path d={this.state.path(this.state.countries)}></path> 
                {/* {
                    this.state.countries.features.map((country,idx)=>{
                        return (<path key={idx} d={this.state.path(country.geometry)}></path>)
                    })
                } */}
                <g>
                    {
                        self.state.quakes.map(function(coords,idx){
                            if(idx < 100){
                                let circle = self.state.projection(coords.geometry.coordinates)
                                return (<circle key={idx} fill="red" cx={circle[0]} cy={circle[1]} r={coords.properties.mag}></circle>)
                            }
                        })
                    }
                </g>
            </svg>
        )
    }

    animate(){
        let self = this;
        let stepa = 0.25;
        let reqanim = requestAnimationFrame(zozo.bind(this,stepa));

        function zozo(stepa){
            let scale = self.state.projection.scale();

            self.setState(Object.assign({}, self.state, {
                path:d3.geoPath().projection(self.state.projection.rotate([self.state.projection.rotate()[0]+stepa,0]))
            }))

            requestAnimationFrame(zozo.bind(this,stepa++));            
        }
    }
}


export default Map;
