import { render } from "./render";
import { createElement, createReference } from "./createElement";
import { Component } from "./component";
import { toChildArray } from "./virtualNode";
import { createContext } from "./createContext";
import Fragment from "./builtIns/Fragment";
import { shallowEquals } from "./internal";
import PureComponent from "./builtIns/PureComponent";

export {
	render,
	createElement,
	createElement as h,
	Component,
	PureComponent,
	toChildArray,
	Fragment,
	createReference,
	createContext,
	shallowEquals
};
