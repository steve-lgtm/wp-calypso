/**
 * @jest-environment jsdom
 */
import { getArrayOfFilteredTasks, getEnhancedTasks, isTaskDisabled } from '../task-helper';
import { tasks, launchpadFlowTasks } from '../tasks';
import { buildTask } from './lib/fixtures';

describe( 'Task Helpers', () => {
	describe( 'getEnhancedTasks', () => {
		describe( 'when a task should not be enhanced', () => {
			it( 'then it is not enhanced', () => {
				const fakeTasks = [
					buildTask( { id: 'fake-task-1' } ),
					buildTask( { id: 'fake-task-2' } ),
					buildTask( { id: 'fake-task-3' } ),
				];
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				expect( getEnhancedTasks( fakeTasks, 'fake.wordpress.com', null, () => {} ) ).toEqual(
					fakeTasks
				);
			} );
		} );
		describe( 'when it is link_in_bio_launched task', () => {
			it( 'then it receives launchtask property = true', () => {
				const fakeTasks = [ buildTask( { id: 'link_in_bio_launched' } ) ];
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				const enhancedTasks = getEnhancedTasks( fakeTasks, 'fake.wordpress.com', null, () => {} );
				expect( enhancedTasks[ 0 ].isLaunchTask ).toEqual( true );
			} );
		} );
	} );

	describe( 'getArrayOfFilteredTasks', () => {
		describe( 'when no flow is provided', () => {
			it( 'then no tasks are found', () => {
				expect( getArrayOfFilteredTasks( tasks, null ) ).toBe( null );
			} );
		} );

		describe( 'when a non-existing flow is provided', () => {
			it( 'then no tasks are found', () => {
				expect( getArrayOfFilteredTasks( tasks, 'custom-flow' ) ).toBe( undefined );
			} );
		} );

		describe( 'when an existing flow is provided', () => {
			it( 'then it returns found tasks', () => {
				expect( getArrayOfFilteredTasks( tasks, 'newsletter' ) ).toEqual(
					tasks.filter( ( task ) => launchpadFlowTasks[ 'newsletter' ].includes( task.id ) )
				);
			} );
		} );
	} );
	describe( 'isTaskDisabled', () => {
		describe( 'when a given task has other, dependent tasks that should be completed first', () => {
			describe( 'and the other tasks are incomplete', () => {
				it( 'then the given task is disabled', () => {
					const dependencies = [ true, false ];
					const task = buildTask( { dependencies, isCompleted: false } );
					expect( isTaskDisabled( task ) ).toBe( true );
				} );
			} );
			describe( 'and the other tasks are complete', () => {
				const dependencies = [ true, true ];
				describe( 'and the task can be revisited', () => {
					it( 'then the task is enabled', () => {
						const task = buildTask( { dependencies, keepActive: true, isCompleted: false } );
						expect( isTaskDisabled( task ) ).toBe( false );
					} );
				} );
				describe( 'and the given task complete', () => {
					it( 'then the task is disabled', () => {
						const task = buildTask( { dependencies, keepActive: false, isCompleted: true } );
						expect( isTaskDisabled( task ) ).toBe( true );
					} );
				} );
				describe( 'and the given task is incomplete', () => {
					it( 'then the given task is enabled', () => {
						const task = buildTask( { dependencies, keepActive: false, isCompleted: false } );
						expect( isTaskDisabled( task ) ).toBe( false );
					} );
				} );
			} );
		} );
	} );
} );
