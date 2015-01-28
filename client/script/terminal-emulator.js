( function module( ){
	var TerminalEmulator = React.createClass( {
		"attachAllSocketEvent": function attachAllSocketEvent( ){
			var self = this;
			var socket = this.state.socket;

			socket.on( "output",
				function onOutput( error, result ){
					pubsub.publish( "output", [ error, result ] );
				} );

			pubsub.subscribe( "command",
				function onCommand( commandPhrase ){
					socket.emit( "command", commandPhrase );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"outputList": [ ],
				"inputList": [ ],
				"inputText": "",
				"socket": null
			}
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
				pubsub.publish( "command", [ inputText,
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

		"onEachOutput": function onEachOutput( outputData ){
			var key = generateHash( );

			var type = outputData.type;

			switch( type ){
				case "text":
					return (
						<div
							key={ key }
							className="output text">
							{ outputData.text }
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

		"render": function onRender( ){
			var inputText = this.state.inputText;
			var outputList = this.state.outputList;

			return (
				<section
					className="terminal-container">
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
							onKeyPress={ this.onKeyPressInputText } />
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
		},

		"componentDidMount": function componentDidMount( ){
			var self = this;

			pubsub.subscribe( "output",
				function onOutput( error, result ){
					var outputList = _.clone( self.state.outputList );

					if( error ){
						outputList.push( {
							"type": "error",
							"error": error.message
						} );

					}else{
						outputList.push( result );
					}

					self.setState( {
						"outputList": outputList
					} );
				} );

			pubsub.subscribe( "bind",
				function onBind( socket ){
					self.setState( {
						"socket": socket
					} );
				} );

			pubsub.subscribe( "command",
				function onCommand( commandPhrase, callback ){
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