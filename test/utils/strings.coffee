{ assert } = require('chai')

{
  unicodeLength
  shortenString
  isStringMatched
} = require('../../src//utils/strings')
{ SHORTENED_STRING_TOKEN } = require('../../src//constants/misc')

UNICODE = '💩'

lorem = """
        Lorem ipsum dolor sit amet, #{UNICODE} consectetur adipisicing elit #{UNICODE},
        sed do eiusmod tempor incididunt ut labore #{UNICODE} et dolore magna aliqua.
        Ut enim ad minim veniam, quis #{UNICODE}#{UNICODE}#{UNICODE} nostrud exercitation
        ullamco laboris nisi ut aliquip #{UNICODE} ex ea commodo consequat. Duis aute
        irure dolor #{UNICODE} in reprehenderit in voluptate velit esse cillum #{UNICODE}
        #{UNICODE} dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        #{UNICODE} non proident, sunt in culpa qui officia #{UNICODE} deserunt mollit
        anim id est laborum.
        """

describe 'modules/utils/strings', ->
  it 'unicodeLength', ->
    short = '123'
    complex = UNICODE + short + UNICODE

    expectedShort = short.length
    expectedComplex = short.length + 2

    assert.equal(unicodeLength(), 0, 'nothing')
    assert.equal(unicodeLength(UNICODE), 1, 'single emoji length')
    assert.equal(unicodeLength(short), expectedShort, 'simple ascii string')
    assert.equal(unicodeLength(complex), expectedComplex, 'complex unicode string')

  it 'shortenString', ->
    expected = "Lorem ipsum dolor sit amet, #{UNICODE} consectetur ad#{SHORTENED_STRING_TOKEN}"
    newline = 'abc\n def'
    space = ' '

    emoji = 'abc 👨‍👨‍👧‍👧 def 👩🏽‍🚀'
    expectedEmoji = "abc 👨‍👨‍👧‍👧 def 👩🏽#{SHORTENED_STRING_TOKEN}"

    emoji2 = 'abc ➡️ def'
    expectedEmoji2 = "abc ➡️#{SHORTENED_STRING_TOKEN}"

    assert.equal(shortenString('', 45), '', 'nothing')
    assert.match(shortenString(lorem), new RegExp("#{SHORTENED_STRING_TOKEN}$"), 'injects end of string token at the end')
    assert.equal(shortenString(lorem, 45), expected, 'cuts at expected length')
    assert.match(shortenString(lorem, 155), new RegExp("veniam#{SHORTENED_STRING_TOKEN}$"), 'stripping punctuation at the end')
    assert.equal(shortenString(newline, 6), "abc#{SHORTENED_STRING_TOKEN}", 'stripping newlines at the end')
    assert.equal(shortenString(space, 1), SHORTENED_STRING_TOKEN, 'string containing spaces only returns token only')
    assert.equal(shortenString(lorem, 0), '', 'setting limit to 0 returns empty string')
    assert.isAtMost(unicodeLength(shortenString(lorem, 155)), 155, 'string shortened below limit')

    assert.equal(shortenString(emoji, 20), expectedEmoji, 'trims ZWJ')
    assert.equal(shortenString(emoji2, 6), expectedEmoji2, 'doesn\'t cut off variation selector')
