import { NntpConnection } from 'nntp-fast'

class NntpFaster extends NntpConnection {
  constructor() {
    super()
  }

  async tlsconnect(host, port) {
    const res = await this.connect(host, port ? port : 563, true)

    if ([200 /*, 430, 412, 423, 420*/].includes(res.code)) {
      if (!res.message) throw new Error('no data on message')
      return {
        code: res.code,
        body: res.message,
      }
    } else {
      throw res
    }
  }

  async login(user, pass) {
    await this.runCommand('AUTHINFO USER' + (user ? ' ' + user : ''))

    const res = await this.runCommand(
      'AUTHINFO PASS' + (pass ? ' ' + pass : '')
    )

    if ([281 /*, 430, 412, 423, 420*/].includes(res.code)) {
      if (!res.message) throw new Error('no data on message')
      return {
        code: res.code,
        body: res.message,
      }
    } else {
      throw res
    }
  }

  async xover(startarticle, endarticle) {
    const res = await this.runCommand(
      'XOVER' +
        (startarticle ? ' ' + startarticle : '') +
        '-' +
        (endarticle ? ' ' + endarticle : '')
    )

    if ([224 /*, 430, 412, 423, 420*/].includes(res.code)) {
      if (!res.data) throw new Error('no data on body')
      return {
        code: res.code,
        body: res.data
          .toString()
          .split('\r\n')
          .map((x) => x.replaceAll('\t', ' ')),
      }
    } else {
      throw res
    }
  }

  over = this.xover

  async getcapabilities() {
    const res = await this.runCommand('CAPABILITIES')

    if ([101 /*, 430, 412, 423, 420*/].includes(res.code)) {
      if (!res.data) throw new Error('no data on body')
      return {
        code: res.code,
        body: res.data.toString().split('\r\n'),
      }
    } else {
      throw res
    }
  }
}

export { NntpFaster }
