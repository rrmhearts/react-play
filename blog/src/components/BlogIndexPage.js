import React from 'react'
import { Link } from 'react-navi'
import siteMetadata from '../siteMetadata'
import ArticleSummary from './ArticleSummary'
import Bio from './Bio'
import Pagination from './Pagination'
import styles from './BlogIndexPage.module.css'

function BlogIndexPage({ blogRoot, pageCount, pageNumber, postRoutes }) {

  return (

    <div>
      <header>
        <h1 className={styles.title}>
          <Link href={blogRoot}>{siteMetadata.title}</Link>
        </h1>
        <Bio />
      </header>
      <ul className={styles.articlesList}>
        {postRoutes.map(route =>
          <li key={route.url.href}>
            <ArticleSummary blogRoot={blogRoot} route={route} />
          </li>
        )}
      </ul>
      {
        pageCount > 1 &&
        <Pagination
          blogRoot={blogRoot}
          pageCount={pageCount}
          pageNumber={pageNumber}
        />
      }
      <footer className={styles.footer}>
        <div>
          <a
            href='http://mccoppinhome.com'
            style={{ float: 'right' }}>
            © Ryan McCoppin
          </a>
          <Link href='./about'>
            About
          </Link> &bull;{' '}
          <Link href='./tags'>
            Tags
          </Link> &bull;{' '}
          <a href='https://github.com/rrmhearts'>
            Source
          </a>
        </div>
      </footer>
    </div>
  )
}

export default BlogIndexPage