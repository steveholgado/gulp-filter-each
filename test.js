const { test } = require('tap')
const filter = require('./')
const File = require('vinyl')

const mockFile1 = new File({
	path: 'path/to/test-file1.js',
	contents: new Buffer('Test content 1')
})
const mockFile2 = new File({
	path: 'path/to/test-file2.js',
	contents: new Buffer('Test content 2')
})

test('Error checking', t => {
	t.throws(
		() => filter(),
		'Throws if no argument supplied'
	)
	t.throws(
		() => filter('string'),
		'Throws if supplied argument IS NOT a function'
	)
	t.doesNotThrow(
		() => filter(() => {}),
		'Does not throw if supplied argument IS a function'
	)
	t.end()
})

test('File data', t => {
	const stream = filter((content, filepath) => {
		t.equal(
			content,
			'Test content 1',
			'Passes correct file content to function'
		)
		t.equal(
			filepath,
			'path/to/test-file1.js',
			'Passes correct file path to function'
		)
		t.end()
	})

	stream.write(mockFile1)
	stream.end()
})

test('Filtering: Sync', t => {
	const includedFiles = []
	const stream = filter(content => content.match(/1/))

	stream
		.on('data', file => includedFiles.push(file))
		.on('end', () => {
			t.equal(
				includedFiles.length,
				1,
				'Includes the correct number of files'
			)
			t.equal(
				includedFiles[0].path,
				'path/to/test-file1.js',
				'Includes the correct files'
			)
			t.end()
		})

	stream.write(mockFile1)
	stream.write(mockFile2)
	stream.end()
})

test('Filtering: Async', t => {
	const includedFiles = []
	const stream = filter((content, filepath, done) => {
		setTimeout(() => {
			const match = content.match(/1/)
			done(match)
		}, 0)
	})

	stream
		.on('data', file => includedFiles.push(file))
		.on('end', () => {
			t.equal(
				includedFiles.length,
				1,
				'Includes the correct number of files'
			)
			t.equal(
				includedFiles[0].path,
				'path/to/test-file1.js',
				'Includes the correct files'
			)
			t.end()
		})

	stream.write(mockFile1)
	stream.write(mockFile2)
	stream.end()
})
