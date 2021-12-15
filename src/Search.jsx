import React from 'react';
import Resolution from '@unstoppabledomains/resolution';
import { NftGallery } from 'react-nft-gallery';
import { QRCode } from 'react-qrcode-logo';

import './css/Search.css';
import logo from './img/uds180.png';

class Search extends React.Component {
  constructor(props) {
    super(props);
	
    this.state = { domain: "",
	               address: "",
                   error: false,
                   lookup: false,
                   searched: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	this.handleCleanup = this.handleCleanup.bind(this);
	this.displayLookup = this.displayLookup.bind(this)
	this.displayGallery = this.displayGallery.bind(this);
	this.displayError = this.displayError.bind(this);
	this.resolve = this.resolve.bind(this);
  }

  handleChange(event) {
    this.setState({domain: event.target.value});
	this.setState({address: ''});
	this.setState({lookup: false});
	this.domain = event.target.value;
  }
  
  handleCleanup = () => {
    const elements = document.getElementsByClassName('rnftg-item');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
  
  handleSubmit(event) {
	this.handleCleanup();
	this.setState({searched: true});
	this.setState({lookup: true});
	this.resolve(this.domain);
    event.preventDefault();
  }
  
  displayGallery = () => {
	if (this.state.searched && !this.state.error) { 
	  return ( 
	    <>
		  <hr style={{margin: "0 1.5em 0 1.5em"}}/>
	      <div id="gallery" className="animate"><NftGallery ownerAddress={this.state.address} /></div>
	    </>
      );
	}
  }
  
  displayError = () => {
	if (this.state.error) {
	  return (
	    <>
	      <div className="error-wrapper animate">
		    <h1>Uh-oh!</h1>
			<h2>That domain is not registered with Unstoppable</h2>
		  </div>
		</>
	  );
	}
  }
  
  displayLookup = () => {
	const etherlink = 'https://etherscan.io/address/' + this.state.address;
	
    if (this.state.lookup && !this.state.error) {
	  return (
	    <>
		  <ul className="lookup-wrapper animate">
		    <li>
			  <span className="lookup-title">Domain </span>
			  <span className="lookup-content">{this.domain}</span>
			</li>
			<li>
			  <span className="lookup-title">Address</span>
			  <span className="lookup-content">{this.state.address}</span>
			</li>
			<li className="lookup-es">
			  <a href={etherlink} target="_blank" rel="noreferrer" className="lookup-esa">View on Etherscan</a>
			</li>
			<QRCode
				value={this.state.address}
				eyeRadius={5} // 5 pixel radius for all corners of all positional eyes
			/>
		  </ul>
		</>
	  );
	}
  }
  
  resolve = (domain) => {
    let resolution = new Resolution({ blockchain: {
      uns: {
        url: "https://mainnet.infura.io/v3/12351245223",
        network: "mainnet"
      }
    }});
	
	resolution.isRegistered(domain).then((result) => {
		if (result) {
			this.setState({error: false});
			resolution.addr(domain, "eth")
	                  .then(addr => this.setState({address: addr}));
		} else {
			this.setState({error: true});
		}
	});
    
  }
  
	render() { 
		return (
		<div className="form-wrapper animate">
		  <form className="search-form" onSubmit={this.handleSubmit}>
		    <div className="search-wrapper">
			  <ul className="search-header">
			    <li><img className="" src={logo} alt="logo"/></li>
				<hr style={{margin: "1.5em 15em 0 15em"}}/>
				<li className="search-desc"><h2>Unstoppable Domains Profile. Resolve UD address. View Qr-code and NFTs.</h2></li>
		      </ul>
			  
			  <input type="text" className="search-bar" placeholder="Domain address..." value={this.state.domain} onChange={this.handleChange} />
			  <input type="submit" className="search-btn" value="Search" />
			</div>
			
			{ this.displayError() }
			{ this.displayLookup() }
			{ this.displayGallery() }

		  </form>

		</div>
		);
	}
	
}
export default Search;