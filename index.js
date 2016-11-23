'use strict'

var uuid = require('uuid')
/**
 *
 * @param {string} content - required. the content of the event
 * @param {string|boolean} [id=null] optional id. if does not exist, will be generated automatically. if false, will not generate
 */
function sendData (res) {
  return function (content, id) {
    if (!id && id !== false) {
      id = uuid.v4()
    }
    if (id !== false) {
      res.write('id: ' + id + '\ndata: ' + JSON.stringify(content) + '\n\n')
    } else { // support none event flushing
      res.write(content + '\n\n')
    }
    res.flushHeaders()
  }
}

function sse (req, res, next) {
  req.socket.setKeepAlive(true)
  req.socket.setTimeout(0)

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.status(200)

  // export a function to send server-side-events
  res.sse = sendData(res)

  // write 2kB of padding (for IE) and a reconnection timeout
  // then use res.sse to send to the client
  res.write(':' + Array(2049).join(' ') + '\n')
  res.sse('retry: 2000', false)

  // keep the connection open by sending a comment
  var keepAlive = setInterval(function () {
    res.sse(':keep-alive', false)
  }, 20000)

  // cleanup on close
  res.on('close', function () {
    clearInterval(keepAlive)
  })

  next()
}

module.exports = sse
