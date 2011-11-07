
ast = parser.parse '''
a
;( a b c d )

'''
console.log "ast:", ast