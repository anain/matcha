Matcha is a dating website who uses a simple algorithm to suggest matching profiles and allow user to search by themselves according to their criteria.
It comes with a seed of unique randomly generated profiles with scrapped pictures.

To run it you need postgresql with a user having acess to a database 'matcha' with a password.
The user and his password are to be registered as environment variables.

Installation

1) sh setup.sh 
2) sh debug.sh
2) cd matcha/matcha/static
npm i
npm run watch
