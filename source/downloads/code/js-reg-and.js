var s='data0', m=/^([a-z]+)(\d+)$/.exec(s);

/* the most common (and obvious) way to 
 * check if there is match and the 2nd captured group's value is 0
 * would be
*/
if(m) {
	if( m[2] === '0' ) {
		console.log('maybe');
	}
}


/* but the above code can be simplified to */

if( m && m[2] === '0') {
	console.log('maybe');
}

/* the technique can also be used in switch-case statement */
 
switch( m && m[2] ) {
	case '1':
		console.log('never');
		break;
	case '0':
		console.log('maybe');
		break;
	default:
		console.log('run out of options')
}
