( function module( ){
	var TerminalEmulator = React.createClass( {
		"attachAllSocketEvent": function attachAllSocketEvent( ){
			var self = this;
			var socket = this.state.socket;

			socket.on( "output",
				function onOutput( error, result, durationData, reference ){

					durationData = requestResponseDuration( durationData );

					pubsub.publish( "output", [ error, result, durationData, reference ] );

					socket.emit( "record-duration", reference, durationData );
				} );

			pubsub.subscribe( "command",
				function onCommand( commandPhrase, commandData, callback ){
					socket.emit( "command", 
						commandPhrase,
						commandData,
						getRequestTime( ), 
						generateReference( ) );
				} );

			var timeout = setTimeout( function onTimeout( ){
				pubsub.publish( "bound-socket" );

				clearTimeout( timeout );
			}, 0 );
		},

		"getInitialState": function getInitialState( ){
			return {
				"outputList": [ ],
				"inputList": [ ],
				"inputText": "",
				"socket": null
			};
		},

		"onBlurInputText": function onBlurInputText( ){
			$( "input", this.getDOMNode( ) ).focus( );
		},

		"onChangeInputText": function onChangeInputText( event ){
			this.setState( {
				"inputText": event.target.value
			} );
		},

		"onKeyPressInputText": function onKeyPressInputText( event ){
			if( event.key == "Enter" ){
				var inputText = event.target.value;

				var outputList = _.clone( this.state.outputList );
				var inputList = _.clone( this.state.inputList );
				
				var self = this;
				pubsub.publish( "command", [ inputText, null,
					function callback( ){
				
						outputList.push( {
							"type": "text",
							"text": inputText
						} );

						inputList.push( {
							"type": "text",
							"text": inputText
						} );

						self.setState( {
							"inputList": inputList,
							"outputList": outputList
						} );	
					} 
				] );

				this.setState( {
					"inputText": ""
				} );
			}
		},

		"onEachOutput": function onEachOutput( outputData, index ){
			var key = generateHash( );

			var type = outputData.type;

			var duration = outputData.duration;

			var durationPhrase = [
				duration.requestDuration,
				duration.responseDuration,
				duration.totalDuration
			].join( "|" );

			var reference = outputData.reference;

			switch( type ){
				case "text":
					return (
						<div
							key={ key }
							className="output text">
							{ outputData.text }
							<span
								className="reference">
								{ reference }
							</span>
							<span 
								className="duration">
								{ durationPhrase }			
							</span>
						</div>
					);
					
				case "chart":
					break;

				case "error":
					return (
						<div
							key={ key }
							className="output error">
							{ outputData.error }
							<span
								className="reference">
								{ reference }
							</span>
							<span 
								className="duration">
								{ durationPhrase }			
							</span>
						</div>
					);

				default:
					return (
						<div
							key={ key }
							className="output empty">
						</div>
					);
			}
		},

		"componentWillMount": function componentWillMount( ){

		},

		"render": function onRender( ){
			var inputText = this.state.inputText;
			var outputList = this.state.outputList;

			return (
				<section
					className={ [
						"terminal-container",
						"col-xs-12",
						"col-sm-6",
						"col-md-8",
						"col-lg-6"
					].join( " " ) } >
					<section
						className="output-container">
						{ outputList.map( this.onEachOutput ) }
					</section>

					<section
						className="input-container">
						<input
							type="text"
							placeholder="Enter command here"
							value ={ inputText }
							onChange={ this.onChangeInputText }
							onKeyPress={ this.onKeyPressInputText }
							onBlur={ this.onBlurInputText } />
					</section>
				</section>
			);
		},

		"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
			if( prevState.socket === null && 
				prevState.socket != this.state.socket )
			{
				this.attachAllSocketEvent( );
			}

			if( !_.isEqual( prevState.outputList, this.state.outputList ) ){
				var self = this;

				if( this.scrollTimeout ){
					clearTimeout( this.scrollTimeout );

					this.scrollTimeout = null;
				}

				this.scrollTimeout = setTimeout( function onTimeout( ){
					var outputContainer = $( ".output-container", self.getDOMNode( ) );

					outputContainer.animate( { 
						"scrollTop": outputContainer.height( ) 
					}, "slow" );

					clearTimeout( self.scrollTimeout );

					this.scrollTimeout = null;
				}, 500 );
			}
		},

		"componentDidMount": function componentDidMount( ){
			var self = this;

			pubsub.subscribe( "bind",
				function onBind( socket ){
					self.setState( {
						"socket": socket
					} );
				} );

			pubsub.subscribe( "output",
				function onOutput( error, result, durationData, reference ){
					durationData = _.clone( durationData );	
		
					var outputList = _.clone( self.state.outputList );

					if( error ){
						outputList.push( {
							"duration": durationData,
							"reference": reference,
							"type": "error",
							"error": error.message
						} );

					}else{
						result.duration = durationData;
						result.reference = reference;

						outputList.push( result );
					}

					self.setState( {
						"outputList": outputList
					} );
				} );

			pubsub.subscribe( "command",
				function onCommand( commandPhrase, commandData, callback ){
					if( _.isEmpty( self.state.socket ) ){
						callback( );
					}
				} );
		}
	} );

	$( ".terminal-emulator" )
		.ready( function onReady( ){
			React.render( <TerminalEmulator />, $( ".terminal-emulator" )[ 0 ] );		
		} );
} )( );