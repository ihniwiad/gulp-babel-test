import $ from "jquery"
import { sayHello } from './say-hello.js'


// importet function
sayHello( {
  name: 'MyName :)',
} );


// jquery test
$( 'h1' ).html( 'jQuery manipulated' );

