import functools
# The _checkAuth should return a user object, and this
# configure which property from that objet get the 'role'
_userRolePropertyName = 'role'

def _checkRole(role, roles):
    ''' Check given role is inside or equals to roles '''
    # Roles is a list not a single element
    if isinstance(roles, list):
        found = False
        for r in roles:
            if r == role:
                found = True
                break

        if found == True:
            return True

    # Role is a single string
    else:
        if role == roles:
            return True

    return False

def allowedRole(roles = None):
    def decorator(func):
        def decorated(self, *args, **kwargs):
            user = self.current_user
            # User is refused
            if user is None:
                raise Exception('Cannot proceed role check: user not found')
            if user['admin']:
                role = 'admin'
            else:
                role = 'user'
            #role = user[_userRolePropertyName]

            if _checkRole(role, roles) == False:
                self.set_status(403)
                self._transforms = []
                self.finish({'status':'error','message':'endpoint not allowed for the current user role'})
                return None

            return func(self, *args, **kwargs)
        return decorated
    return decorator

def refusedRole(roles = None):
    def decorator(func):
        def decorated(self, *args, **kwargs):
            user = self.current_user
            # User is refused
            if user is None:
                raise Exception('Cannot proceed role check: user not found')
            if user['admin']:
                role = 'admin'
            else:
                role = 'user'
            #role = user[_userRolePropertyName]

            if _checkRole(role, roles) == True:
                self.set_status(403)
                self._transforms = []
                self.finish({'status':'error','message':'endpoint not allowed for the current user role'})
                return None

            return func(self, *args, **kwargs)
        return decorated
    return decorator
