import { compose, lazy, map, mount, redirect, resolve, route, withContext, withView } from 'navi'
import React from 'react'
import { join } from 'path'
import { chunk, fromPairs } from 'lodash'
import BlogIndexPage from '../components/BlogIndexPage'
import BlogLayout from '../components/BlogLayout'
import BlogPostLayout from '../components/BlogPostLayout'
import siteMetadata from '../siteMetadata'
import posts from './posts'
import { push as Menu } from 'react-burger-menu'
import { Link } from 'react-navi'
import { SocialIcon } from 'react-social-icons';

var stylesBurger = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '36px',
    top: '36px'
  },
  bmBurgerBars: {
    background: '#4aaaa0'
  },
  bmBurgerBarsHover: {
    background: '#4aaaa0'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#4aaaa0'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#4aaaa0',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#4aaaa0',
    padding: '0.8em'
  },
  bmItem: {
    color: '#FFFFFF',
    textDecoration: "none",
    fontSize: '24px'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  },
  img: {
    borderRadius: '100%',
    display: 'block',
    width: '100%',
  }
}
// Split the posts into a list of chunks of the given size, and
// then build index pages for each chunk.
let chunks = chunk(posts, siteMetadata.indexPageSize)
let chunkPagePairs = chunks.map((chunk, i) => [
  '/' + (i + 1),
  map(async (req, context) => {
    // Don't load anything when just crawling
    if (req.method === 'HEAD') {
      return route()
    }

    // Get metadata for all pages on this page
    let postRoutes = await Promise.all(
      chunk.map(async post => {
        let href = join(context.blogRoot, 'posts', post.slug)
        return await resolve({
          // If you want to show the page content on the index page, set
          // this to 'GET' to be able to access it.
          method: 'HEAD',
          routes,
          url: href,
        })
      }),
    )

    // Only add a page number to the page title after the first index page.
    let pageTitle = siteMetadata.title
    if (i > 0) {
      pageTitle += ` – page ${i + 1}`
    }

    return route({
      title: pageTitle,
      view: (

        <BlogIndexPage
          blogRoot={context.blogRoot}
          pageNumber={i + 1}
          pageCount={chunks.length}
          postRoutes={postRoutes}
        />
      ),
    })
  }),
])

const routes = compose(
  withContext((req, context) => ({
    ...context,
    blogRoot: req.mountpath || '/',
  })),
  withView((req, context) => {
    // Check if the current page is an index page by comparing the remaining
    // portion of the URL's pathname with the index page paths.
    let isViewingIndex = req.path === '/' || /^\/page\/\d+\/$/.test(req.path)

    let getMenu = () => {
      return (
        <Menu styles={stylesBurger} pageWrapId={'page-wrap'} right={false}>
          <img className='photoSide' src={ require('../images/ryanbaby.jpg') } alt=""/>
          <h1 className="align-right">Ryan McCoppin</h1>
          <span>
            <SocialIcon url="http://twitter.com/rrmhearts" />
            <SocialIcon url="https://github.com/rrmhearts" />
            <SocialIcon url="https://codepen.io/rrmhearts" />
            <SocialIcon url="rrmhearts@gmail.com" />
          </span>
          <Link className='bottom-links' href='/'>[Home]</Link>
          <Link href='/about'>[About]</Link>
        </Menu>
      );
    };
    // Render the application-wide layout
    return (
      <div className="outer-container">
        {getMenu()}
        <div id="page-wrap">
        <BlogLayout
          blogRoot={context.blogRoot}
          isViewingIndex={isViewingIndex}
        />
        </div>
      </div>
    )
  }),
  mount({
    // The blog's index pages go here. The first index page is mapped to the
    // root URL, with a redirect from "/page/1". Subsequent index pages are
    // mapped to "/page/n".
    '/': chunkPagePairs.shift()[1],
    '/page': mount({
      '/1': redirect((req, context) => context.blogRoot),
      ...fromPairs(chunkPagePairs),
    }),

    // Put posts under "/posts", so that they can be wrapped with a
    // "<BlogPostLayout />" that configures MDX and adds a post-specific layout.
    '/posts': compose(
      withView((req, context) => <BlogPostLayout blogRoot={context.blogRoot} />),
      mount(fromPairs(posts.map(post => ['/' + post.slug, post.getPage]))),
    ),

    // Miscellaneous pages can be added directly to the root switch.
    '/tags': lazy(() => import('./tags')),
    '/about': lazy(() => import('./about')),

    // Only the statically built copy of the RSS feed is intended to be opened,
    // but the route is defined here so that the static renderer will pick it
    // up.
    '/rss': route(),
  }),
)

export default routes
