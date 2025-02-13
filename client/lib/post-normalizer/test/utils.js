import { isFeaturedImageInContent } from '../utils';

describe( 'isFeaturedImageInContent', () => {
	test( 'should detect identical urls', () => {
		const post = {
			post_thumbnail: {
				URL: 'http://example.com/image.jpg',
			},
			images: [ { src: 'http://example.com/image.jpg' }, { src: 'http://example.com/image.jpg' } ],
		};
		expect( isFeaturedImageInContent( post ) ).toEqual( 1 );
	} );

	test( 'should return false when no images', () => {
		const post = {
			post_thumbnail: {
				URL: 'http://example.com/image.jpg',
			},
			images: [],
		};
		expect( isFeaturedImageInContent( post ) ).toBe( false );
	} );

	test( 'should return false when image is not in content', () => {
		const post = {
			post_thumbnail: {
				URL: 'http://example.com/image.jpg',
			},
			images: [ { src: 'http://example.com/image.jpg' }, { src: 'http://example.com/one.jpg' } ],
		};
		expect( isFeaturedImageInContent( post ) ).toBe( false );
	} );

	test( 'should ignore hostname when comparing', () => {
		const post = {
			post_thumbnail: {
				URL: 'http://example2.com/image.jpg',
			},
			images: [ { src: 'http://example.com/image.jpg' }, { src: 'http://example.com/image.jpg' } ],
		};
		expect( isFeaturedImageInContent( post ) ).toEqual( 1 );
	} );

	test( 'should understand photon urls embed the hostname when comparing', () => {
		const post = {
			post_thumbnail: {
				URL: 'http://i0.wp.com/example2.com/image.jpg',
			},
			images: [ { src: 'http://example.com/image.jpg' }, { src: 'http://example.com/image.jpg' } ],
		};
		expect( isFeaturedImageInContent( post ) ).toEqual( 1 );
	} );
} );
