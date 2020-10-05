// LOCAL STRATEGY

const LocalStrategy = require('passport-local').Strategy;
// const ActiveDirectoryStrategy = require('passport-activedirectory').Strategy;
var ActiveDirectoryStrategy = require('passport-activedirectory');
const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/user');

module.exports = function (passport) {

  passport.use(
    new LocalStrategy({ usernameField: 'login' }, (login, password, done) => {
      // Match user
      User.findOne({
        login: login
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That login is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      }).catch(err => console.log(err));
    })
  );

  passport.use(new ActiveDirectoryStrategy({
    integrated: false,
    ldap: {
      url: 'ldap://192.168.0.153:389',
      baseDN: 'DC=mir,DC=local',
      searchBase: 'OU=Groups,OU=Morski Instytut Rybacki,DC=mir,DC=local',
      searchFilter: '(&(objectClass=user)(sAMAccountName=%s))',
      username: 'authjs',
      password: 'Mo33@22Mo'
    }
  }, function (profile, ad, done) {
    ad.isUserMemberOf(profile._json.dn, 'AccessGroup', function (err, isMember) {
      if (err) return done(err);

      User.findOne({
        login: profile._json.sAMAccountName
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That login is not registered - Active Directory' });
        }
        return done(null, user);
      });
      // return done(null, profile);
    });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  // passport.serializeUser(function (user, done) {
  //   // done(null, user.id);
  //   // console.log('serialize', user);
  //   done(null, user._id);
  // });

  // passport.deserializeUser(function (id, done) {
  //   User.findById(id, function (err, user) {
  //     done(err, user);
  //   });
  // });
};


// MIR - LDAP - ACTIVE DIRECTORY

// var ActiveDirectoryStrategy = require('passport-activedirectory');

// module.exports = function (passport) {
//   passport.use(new ActiveDirectoryStrategy({
//     integrated: false,
//     ldap: {
//       url: 'ldap://192.168.0.153:389',
//       baseDN: 'DC=mir,DC=local',
//       searchBase: 'OU=Groups,OU=Morski Instytut Rybacki,DC=mir,DC=local',
//       searchFilter: '(&(objectClass=user)(sAMAccountName=%s))',
//       username: 'authjs',
//       password: 'Mo33@22Mo'
//     }
//   }, function (profile, ad, done) {
//     ad.isUserMemberOf(profile._json.dn, 'AccessGroup', function (err, isMember) {
//       console.log('ERR', err);
//       if (err) return done(err);
//       return done(null, profile);
//     });
//   }));

//   passport.serializeUser(function (user, done) {
//     done(null, user);
//   });

//   passport.deserializeUser(function (user, done) {
//     done(null, user);
//   });

// };

