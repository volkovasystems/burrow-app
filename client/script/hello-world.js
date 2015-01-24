( function module( ){
	var HelloWorld = React.createClass( {
		"render": function onRender( ){
			return (
				<div>
					Hello World
				</div>
			);
		}
	} );

	React.render( <HelloWorld />, $( ".hello-world" )[ 0 ] );
} )( );