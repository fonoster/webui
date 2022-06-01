/* eslint-disable sonarjs/no-duplicate-string */
import { Menu, Transition } from '@headlessui/react'
import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

import { CurrentProjectSelector } from '@/mods/projects/components/current-project'
import { classes } from '@/mods/shared/helpers/classes'
import { Title } from '@/ui'

import { Logo } from '../Logo'
import { MobileMenu } from '.'
import { menu } from './menu'

export const Sidebar = () => {
  const { pathname } = useRouter()

  return (
    <>
      <div
        className="hidden w-60 dark:bg-gray-500 overflow-visible md:block border-r"
        style={{ borderColor: '#4F5358' }}
      >
        <div className="w-full py-6 flex flex-col items-center">
          <div className="w-full px-4 flex-shrink-0 flex justify-between">
            <Logo />
            <Link href={'/home'}>
              <a>
                <HomeIcon
                  className="block h-6 w-6 text-gray-300"
                  aria-hidden="true"
                />
              </a>
            </Link>
          </div>
          <CurrentProjectSelector />
          <div className="flex-1 mt-6 w-full px-2 space-y-1">
            {menu.map(item =>
              item.menu ? (
                <Menu as="div" key={item.name} className="z-10 flex-shrink-0">
                  <div>
                    <Menu.Button
                      className={classes(
                        'text-gray-300 hover:bg-dark-600 hover:text-white',
                        'group w-full p-4 flex items-center'
                      )}
                    >
                      <item.icon
                        className={classes(
                          'mr-4 text-gray-300 group-hover:text-white',
                          'h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="z-10 px-6 origin-bottom-right left-60 absolute top-0 overflow-y-auto w-60 shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none h-screen">
                      <Title level={4} className="mt-4">
                        {item.name}
                      </Title>

                      {item.menu.map(subItem => (
                        <Menu.Item key={item.name}>
                          {() => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              passHref
                            >
                              <a
                                className={classes(
                                  'group w-full py-4 rounded-md flex flex-col font-medium hover:text-white',
                                  pathname === subItem.href
                                    ? 'text-white'
                                    : 'text-gray-300'
                                )}
                              >
                                {subItem.name}
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Link key={item.name} href={item.href as string}>
                  <a
                    key={item.name}
                    className={classes(
                      'hover:bg-dark-600 hover:text-white',
                      'relative cursor-pointer group w-full p-4 flex items-center',
                      pathname === item.href
                        ? 'bg-dark-600 text-white'
                        : 'text-gray-300'
                    )}
                    target={item?.target ?? '_self'}
                  >
                    {item?.target === '_blank' && (
                      <span
                        className="pointer-events-none absolute top-2 right-2 text-gray-400 group-hover:text-gray-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-3 w-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                        </svg>
                      </span>
                    )}
                    <item.icon
                      className={classes(
                        'mr-4 group-hover:text-white',
                        'h-6 w-6',
                        pathname === item.href ? 'text-white' : 'text-gray-300'
                      )}
                      aria-hidden="true"
                    />
                    <span className="">{item.name}</span>
                  </a>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
