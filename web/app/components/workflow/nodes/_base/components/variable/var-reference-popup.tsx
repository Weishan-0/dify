'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useHover } from 'ahooks'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { type NodeOutPutVar, type ValueSelector, type Var, VarType } from '@/app/components/workflow/types'
import { Variable02 } from '@/app/components/base/icons/src/vender/solid/development'
import { ChevronRight } from '@/app/components/base/icons/src/vender/line/arrows'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'

type ObjectChildrenProps = {
  nodeId: string
  title: string
  data: Var[]
  objPath: string[]
  onChange: (value: ValueSelector) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
}

type ItemProps = {
  nodeId: string
  title: string
  objPath: string[]
  itemData: Var
  onChange: (value: ValueSelector) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
}

const Item: FC<ItemProps> = ({
  nodeId,
  title,
  objPath,
  itemData,
  onChange,
  onHovering,
  itemWidth,
}) => {
  const isObj = itemData.type === VarType.object && itemData.children && itemData.children.length > 0
  const itemRef = useRef(null)
  const [isItemHovering, setIsItemHovering] = useState(false)
  const _ = useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true)
      }
      else {
        setTimeout(() => {
          setIsItemHovering(false)
        }, 100)
      }
    },
  })
  const [isChildrenHovering, setIsChildrenHovering] = useState(false)
  const isHovering = isItemHovering || isChildrenHovering
  const open = isObj && isHovering
  useEffect(() => {
    onHovering && onHovering(isHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])
  const handleChosen = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([nodeId, ...objPath, itemData.variable])
  }
  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={() => { }}
      placement='left-start'
    >
      <PortalToFollowElemTrigger className='w-full'>
        <div
          ref={itemRef}
          className={cn(
            isObj ? ' pr-1' : 'pr-[18px]',
            isHovering && (isObj ? 'bg-primary-50' : 'bg-gray-50'),
            'relative w-full flex items-center h-6 pl-3  rounded-md cursor-pointer')
          }
          // style={{ width: itemWidth || 252 }}
          onClick={handleChosen}
        >
          <div className='flex items-center w-0 grow'>
            <Variable02 className='shrink-0 w-3.5 h-3.5 text-primary-500' />
            <div className='ml-1 w-0 grow text-ellipsis text-[13px] font-normal text-gray-900'>{itemData.variable}</div>
          </div>
          <div className='ml-1 shrink-0 text-xs font-normal text-gray-500 capitalize'>{itemData.type}</div>
          {isObj && (
            <ChevronRight className='ml-0.5 w-3 h-3 text-gray-500' />
          )}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{
        zIndex: 100,
      }}>
        {isObj && (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <ObjectChildren
            nodeId={nodeId}
            title={title}
            objPath={[...objPath, itemData.variable]}
            data={itemData.children as Var[]}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            itemWidth={itemWidth}
          />
        )}
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

const ObjectChildren: FC<ObjectChildrenProps> = ({
  title,
  nodeId,
  objPath,
  data,
  onChange,
  onHovering,
  itemWidth,
}) => {
  const currObjPath = objPath
  const itemRef = useRef(null)
  const [isItemHovering, setIsItemHovering] = useState(false)
  const _ = useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true)
      }
      else {
        setTimeout(() => {
          setIsItemHovering(false)
        }, 100)
      }
    },
  })
  const [isChildrenHovering, setIsChildrenHovering] = useState(false)
  const isHovering = isItemHovering || isChildrenHovering
  useEffect(() => {
    onHovering && onHovering(isHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])
  useEffect(() => {
    onHovering && onHovering(isItemHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isItemHovering])
  // absolute top-[-2px]
  return (
    <div ref={itemRef} className=' bg-white rounded-lg border border-gray-200 shadow-lg space-y-1' style={{
      right: itemWidth ? itemWidth - 10 : 215,
      minWidth: 252,
    }}>
      <div className='flex items-center h-[22px] px-3 text-xs font-normal text-gray-700'><span className='text-gray-500'>{title}.</span>{currObjPath.join('.')}</div>
      {
        (data && data.length > 0)
        && data.map((v, i) => (
          <Item
            key={i}
            nodeId={nodeId}
            title={title}
            objPath={objPath}
            itemData={v}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
          />
        ))
      }
    </div>
  )
}

type Props = {
  vars: NodeOutPutVar[]
  onChange: (value: ValueSelector) => void
  itemWidth?: number
}
const VarReferencePopup: FC<Props> = ({
  vars,
  onChange,
  itemWidth,
}) => {
  const { t } = useTranslation()
  // max-h-[300px] overflow-y-auto todo: use portal to handle long list
  return (
    <div className='p-1 bg-white rounded-lg border border-gray-200 shadow-lg space-y-1' style={{
      width: itemWidth || 228,
    }}>
      {vars.length > 0
        ? vars.map((item, i) => (
          <div key={i}>
            <div className='flex items-center h-[22px] px-3 text-xs font-medium text-gray-500 uppercase'>{item.title}</div>
            {item.vars.map((v, j) => (
              <Item
                key={j}
                title={item.title}
                nodeId={item.nodeId}
                objPath={[]}
                itemData={v}
                onChange={onChange}
                itemWidth={itemWidth}
              />
            ))}
          </div>
        ))
        : <div className='pl-3 leading-[18px] text-xs font-medium text-gray-500 uppercase'>{t('workflow.common.noVar')}</div>}
    </div>
  )
}
export default React.memo(VarReferencePopup)
