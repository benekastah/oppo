qc = require 'quickcheck'
oppo = require 'oppo'

oppo.module 'oppo.test.lib', ->
  self = this
  
  self.qc = qc

  # qc.test true

  ## Add my own properties and generators here
  self.properties = {}
  self.generators = {}